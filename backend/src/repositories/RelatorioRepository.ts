import { prisma } from "../config/prisma"

export class RelatorioRepository {
    listar() {
        return prisma.relatorio.findMany({ include: { aeronave: true } })
    }

    criar(data: { cliente: string; dataEntrega: string; detalhes: string; aeronaveId: number }) {
        return prisma.relatorio.create({ data })
    }
}