import { AeronaveRepository } from "../repositories/AeronaveRepository"
import { EtapaRepository } from "../repositories/EtapaRepository"

const aeronaveRepo = new AeronaveRepository()
const etapaRepo = new EtapaRepository()

export class EtapaService {
    async criar(codigoAeronave: string, data: { nome: string; prazo: string }) {
        const aeronave = await aeronaveRepo.buscarPorCodigo(codigoAeronave)
        if (!aeronave) throw new Error("Aeronave não encontrada.")
        return etapaRepo.criar({ ...data, status: "Pendente", aeronaveId: aeronave.id })
    }

    async iniciar(codigoAeronave: string, etapaId: number) {
        const aeronave = await aeronaveRepo.buscarPorCodigo(codigoAeronave)
        if (!aeronave) throw new Error("Aeronave não encontrada.")

        const todasProntas = aeronave.pecas.length > 0 &&
            aeronave.pecas.every(p => p.status === "Pronta")
        if (!todasProntas) throw new Error("Todas as peças devem estar prontas.")

        const etapa = await etapaRepo.buscarPorId(etapaId)
        if (!etapa) throw new Error("Etapa não encontrada.")
        if (etapa.status !== "Pendente") throw new Error("Etapa já foi iniciada.")

        const index = aeronave.etapas.findIndex(e => e.id === etapaId)
        if (index > 0 && aeronave.etapas[index - 1].status !== "Concluída") {
            throw new Error("A etapa anterior ainda não foi concluída.")
        }

        return etapaRepo.atualizarStatus(etapaId, "Andamento")
    }

    async finalizar(etapaId: number) {
        const etapa = await etapaRepo.buscarPorId(etapaId)
        if (!etapa) throw new Error("Etapa não encontrada.")
        if (etapa.status !== "Andamento") throw new Error("Etapa não foi iniciada.")
        return etapaRepo.atualizarStatus(etapaId, "Concluída")
    }
}