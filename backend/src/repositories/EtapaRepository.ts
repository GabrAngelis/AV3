import { prisma } from "../config/prisma"

export class EtapaRepository {
    criar(data: { nome: string; prazo: string; status: string; aeronaveId: number }) {
        return prisma.etapa.create({ data })
    }

    buscarPorId(id: number) {
        return prisma.etapa.findUnique({ where: { id } })
    }

    atualizarStatus(id: number, status: string) {
        return prisma.etapa.update({ where: { id }, data: { status } })
    }
}