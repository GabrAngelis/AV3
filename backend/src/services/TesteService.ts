import { AeronaveRepository } from "../repositories/AeronaveRepository"
import { TesteRepository } from "../repositories/TesteRepository"

const aeronaveRepo = new AeronaveRepository()
const testeRepo = new TesteRepository()

export class TesteService {
    async adicionar(codigoAeronave: string, data: { tipo: string; resultado: string }) {
        const aeronave = await aeronaveRepo.buscarPorCodigo(codigoAeronave)
        if (!aeronave) throw new Error("Aeronave não encontrada.")

        const todasConcluidas = aeronave.etapas.length > 0 &&
            aeronave.etapas.every(e => e.status === "Concluída")
        if (!todasConcluidas) throw new Error("Todas as etapas devem estar concluídas.")

        const existente = aeronave.testes.find(t => t.tipo === data.tipo)
        if (existente) {
            if (existente.resultado === "Aprovado") throw new Error("Teste já aprovado e não pode ser refeito.")
            return testeRepo.atualizar(existente.id, data.resultado)
        }

        return testeRepo.criar({ ...data, aeronaveId: aeronave.id })
    }
}