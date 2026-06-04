import { AeronaveRepository } from "../repositories/AeronaveRepository"
import { PecaRepository } from "../repositories/PecaRepository"

const aeronaveRepo = new AeronaveRepository()
const pecaRepo = new PecaRepository()

export class PecaService {
    async adicionar(codigoAeronave: string, data: { nome: string; tipo: string; fornecedor: string }) {
        const aeronave = await aeronaveRepo.buscarPorCodigo(codigoAeronave)
        if (!aeronave) throw new Error("Aeronave não encontrada.")

        const existe = await pecaRepo.buscarPorNomeEAeronave(data.nome, aeronave.id)
        if (existe) throw new Error("Peça já adicionada.")

        return pecaRepo.criar({ ...data, status: "Em produção", aeronaveId: aeronave.id })
    }

    async avancarStatus(pecaId: number) {
        const peca = await pecaRepo.buscarPorId(pecaId)
        if (!peca) throw new Error("Peça não encontrada.")
        if (peca.status === "Pronta") throw new Error("Peça já está finalizada.")

        const novoStatus = peca.status === "Em produção" ? "Em transporte" : "Pronta"
        return pecaRepo.atualizarStatus(pecaId, novoStatus)
    }
}