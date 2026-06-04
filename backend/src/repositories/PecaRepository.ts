import { prisma } from "../config/prisma"

export class PecaRepository {
    buscarPorNomeEAeronave(nome: string, aeronaveId: number) {
        return prisma.peca.findFirst({ where: { nome, aeronaveId } })
    }

    criar(data: { nome: string; tipo: string; fornecedor: string; status: string; aeronaveId: number }) {
        return prisma.peca.create({ data })
    }

    buscarPorId(id: number) {
        return prisma.peca.findUnique({ where: { id } })
    }

    atualizarStatus(id: number, status: string) {
        return prisma.peca.update({ where: { id }, data: { status } })
    }
}