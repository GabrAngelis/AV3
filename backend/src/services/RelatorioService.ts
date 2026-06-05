import { AeronaveRepository } from "../repositories/AeronaveRepository"
import { RelatorioRepository } from "../repositories/RelatorioRepository"

const aeronaveRepo = new AeronaveRepository()
const relatorioRepo = new RelatorioRepository()

export class RelatorioService {
    listar() {
        return relatorioRepo.listar()
    }

    async gerar(cliente: string, aeronaveCodigo: string) {
        const aeronave = await aeronaveRepo.buscarPorCodigo(aeronaveCodigo)
        if (!aeronave) throw new Error("Aeronave não encontrada.")

        const todasConcluidas = aeronave.etapas.length > 0 &&
            aeronave.etapas.every(e => e.status === "Concluída")
        if (!todasConcluidas) throw new Error("Todas as etapas devem estar concluídas.")

        const tipos = ["Elétrico", "Hidráulico", "Aerodinâmico"]
        const todosRealizados = tipos.every(t => aeronave.testes.some(te => te.tipo === t))
        if (!todosRealizados) throw new Error("Todos os testes devem ser realizados.")

        const todosAprovados = aeronave.testes.every(t => t.resultado === "Aprovado")
        if (!todosAprovados) throw new Error("Todos os testes devem estar aprovados.")

        const dataEntrega = new Date().toLocaleDateString("pt-BR")

        let detalhes = `DADOS DA AERONAVE\n`
        detalhes += `Código: ${aeronave.codigo}\n`
        detalhes += `Modelo: ${aeronave.modelo}\n`
        detalhes += `Tipo: ${aeronave.tipo}\n`
        detalhes += `Capacidade: ${aeronave.capacidade}\n`
        detalhes += `Alcance: ${aeronave.alcance} km\n\n`
        detalhes += `CLIENTE: ${cliente}\n`
        detalhes += `DATA DE ENTREGA: ${dataEntrega}\n\n`
        if (cliente.toLowerCase().includes("santos dumont")) {
            detalhes += "Mensagem Especial: A Aerocode presta homenagem ao Pai da Aviação.\n\n"
        }
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
        detalhes += `\nSTATUS FINAL: APROVADA`

        return relatorioRepo.criar({ cliente, dataEntrega, detalhes, aeronaveId: aeronave.id })
    }
}