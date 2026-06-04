import express from "express"
import cors from "cors"
import { prisma } from "./config/prisma"

const app = express()

app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())

app.get("/aeronaves", async (req, res) => {
    const aeronaves = await prisma.aeronave.findMany({
        include: {
            pecas: true,
            etapas: true,
            testes: true
        }
    })
    res.json(aeronaves)
})

app.post("/aeronaves", async (req, res) => {
    const { codigo, modelo, tipo, capacidade, alcance } = req.body

    const existe = await prisma.aeronave.findUnique({ where: { codigo } })
    if (existe) {
        return res.status(409).json({ erro: "Já existe uma aeronave com esse código." })
    }

    const aeronave = await prisma.aeronave.create({
        data: { codigo, modelo, tipo, capacidade, alcance }
    })

    res.status(201).json(aeronave)
})

// Adicionar peça
app.post("/aeronaves/:codigo/pecas", async (req, res) => {
    const { codigo } = req.params
    const { nome, tipo, fornecedor } = req.body

    const aeronave = await prisma.aeronave.findUnique({ where: { codigo } })
    if (!aeronave) return res.status(404).json({ erro: "Aeronave não encontrada." })

    const existe = await prisma.peca.findFirst({
        where: { nome, aeronaveId: aeronave.id }
    })
    if (existe) return res.status(409).json({ erro: "Peça já adicionada." })

    const peca = await prisma.peca.create({
        data: {
            nome,
            tipo,
            fornecedor,
            status: "Em produção",
            aeronaveId: aeronave.id
        }
    })

    res.status(201).json(peca)
})

// Avançar status da peça
app.patch("/aeronaves/:codigo/pecas/:pecaId", async (req, res) => {
    const { pecaId } = req.params

    const peca = await prisma.peca.findUnique({ where: { id: Number(pecaId) } })
    if (!peca) return res.status(404).json({ erro: "Peça não encontrada." })

    if (peca.status === "Pronta") {
        return res.status(400).json({ erro: "Peça já está finalizada." })
    }

    const novoStatus =
        peca.status === "Em produção" ? "Em transporte" : "Pronta"

    const atualizada = await prisma.peca.update({
        where: { id: Number(pecaId) },
        data: { status: novoStatus }
    })

    res.json(atualizada)
})

// Criar etapa
app.post("/aeronaves/:codigo/etapas", async (req, res) => {
    const { codigo } = req.params
    const { nome, prazo } = req.body

    const aeronave = await prisma.aeronave.findUnique({ where: { codigo } })
    if (!aeronave) return res.status(404).json({ erro: "Aeronave não encontrada." })

    const etapa = await prisma.etapa.create({
        data: {
            nome,
            prazo,
            status: "Pendente",
            aeronaveId: aeronave.id
        }
    })

    res.status(201).json(etapa)
})

// Iniciar etapa
app.patch("/aeronaves/:codigo/etapas/:etapaId/iniciar", async (req, res) => {
    const { codigo, etapaId } = req.params

    const aeronave = await prisma.aeronave.findUnique({
        where: { codigo },
        include: { pecas: true, etapas: true }
    })
    if (!aeronave) return res.status(404).json({ erro: "Aeronave não encontrada." })

    const todasProntas = aeronave.pecas.length > 0 &&
        aeronave.pecas.every(p => p.status === "Pronta")
    if (!todasProntas) {
        return res.status(400).json({ erro: "Todas as peças devem estar prontas." })
    }

    const etapa = await prisma.etapa.findUnique({ where: { id: Number(etapaId) } })
    if (!etapa) return res.status(404).json({ erro: "Etapa não encontrada." })

    if (etapa.status !== "Pendente") {
        return res.status(400).json({ erro: "Etapa já foi iniciada." })
    }

    const index = aeronave.etapas.findIndex(e => e.id === Number(etapaId))
    if (index > 0 && aeronave.etapas[index - 1].status !== "Concluída") {
        return res.status(400).json({ erro: "A etapa anterior ainda não foi concluída." })
    }

    const atualizada = await prisma.etapa.update({
        where: { id: Number(etapaId) },
        data: { status: "Andamento" }
    })

    res.json(atualizada)
})

// Finalizar etapa
app.patch("/aeronaves/:codigo/etapas/:etapaId/finalizar", async (req, res) => {
    const { etapaId } = req.params

    const etapa = await prisma.etapa.findUnique({ where: { id: Number(etapaId) } })
    if (!etapa) return res.status(404).json({ erro: "Etapa não encontrada." })

    if (etapa.status !== "Andamento") {
        return res.status(400).json({ erro: "Etapa não foi iniciada." })
    }

    const atualizada = await prisma.etapa.update({
        where: { id: Number(etapaId) },
        data: { status: "Concluída" }
    })

    res.json(atualizada)
})

// Adicionar ou substituir teste
app.post("/aeronaves/:codigo/testes", async (req, res) => {
    const { codigo } = req.params
    const { tipo, resultado } = req.body

    const aeronave = await prisma.aeronave.findUnique({
        where: { codigo },
        include: { etapas: true, testes: true }
    })
    if (!aeronave) return res.status(404).json({ erro: "Aeronave não encontrada." })

    const todasConcluidas = aeronave.etapas.length > 0 &&
        aeronave.etapas.every(e => e.status === "Concluída")
    if (!todasConcluidas) {
        return res.status(400).json({ erro: "Todas as etapas devem estar concluídas." })
    }

    const testeExistente = aeronave.testes.find(t => t.tipo === tipo)

    if (testeExistente) {
        if (testeExistente.resultado === "Aprovado") {
            return res.status(400).json({ erro: "Teste já aprovado e não pode ser refeito." })
        }
        // substitui o reprovado
        const atualizado = await prisma.teste.update({
            where: { id: testeExistente.id },
            data: { resultado }
        })
        return res.json(atualizado)
    }

    const teste = await prisma.teste.create({
        data: { tipo, resultado, aeronaveId: aeronave.id }
    })

    res.status(201).json(teste)
})

// Listar relatórios
app.get("/relatorios", async (req, res) => {
    const relatorios = await prisma.relatorio.findMany({
        include: { aeronave: true }
    })
    res.json(relatorios)
})

// Gerar relatório
app.post("/relatorios", async (req, res) => {
    const { cliente, aeronaveCodigo } = req.body

    const aeronave = await prisma.aeronave.findUnique({
        where: { codigo: aeronaveCodigo },
        include: { pecas: true, etapas: true, testes: true }
    })
    if (!aeronave) return res.status(404).json({ erro: "Aeronave não encontrada." })

    const todasEtapasConcluidas = aeronave.etapas.length > 0 &&
        aeronave.etapas.every(e => e.status === "Concluída")
    if (!todasEtapasConcluidas) {
        return res.status(400).json({ erro: "Todas as etapas devem estar concluídas." })
    }

    const tipos = ["Elétrico", "Hidráulico", "Aerodinâmico"]
    const todosRealizados = tipos.every(t => aeronave.testes.some(te => te.tipo === t))
    if (!todosRealizados) {
        return res.status(400).json({ erro: "Todos os testes devem ser realizados." })
    }

    const todosAprovados = aeronave.testes.every(t => t.resultado === "Aprovado")
    if (!todosAprovados) {
        return res.status(400).json({ erro: "Todos os testes devem estar aprovados." })
    }

    const dataEntrega = new Date().toLocaleDateString("pt-BR")
    const statusFinal = "APROVADA"

    let detalhes = `DADOS DA AERONAVE\n`
    detalhes += `Código: ${aeronave.codigo}\n`
    detalhes += `Modelo: ${aeronave.modelo}\n`
    detalhes += `Tipo: ${aeronave.tipo}\n`
    detalhes += `Capacidade: ${aeronave.capacidade}\n`
    detalhes += `Alcance: ${aeronave.alcance} km\n\n`
    detalhes += `CLIENTE: ${cliente}\n`
    detalhes += `DATA DE ENTREGA: ${dataEntrega}\n\n`
    detalhes += `PEÇAS\n`
    aeronave.pecas.forEach((p, i) => {
        detalhes += `[${i}] ${p.nome} | Tipo: ${p.tipo} | Fornecedor: ${p.fornecedor} | Status: ${p.status}\n`
    })
    detalhes += `\nETAPAS\n`
    aeronave.etapas.forEach((e, i) => {
        detalhes += `[${i}] ${e.nome} | Status: ${e.status} | Prazo: ${e.prazo}\n`
    })
    detalhes += `\nTESTES\n`
    aeronave.testes.forEach((t, i) => {
        detalhes += `[${i}] ${t.tipo} | Resultado: ${t.resultado}\n`
    })
    detalhes += `\nSTATUS FINAL: ${statusFinal}`

    const relatorio = await prisma.relatorio.create({
        data: { cliente, dataEntrega, detalhes, aeronaveId: aeronave.id }
    })

    res.status(201).json(relatorio)
})

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000")
})