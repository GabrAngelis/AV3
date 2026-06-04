import { prisma } from "../config/prisma"

export class TesteRepository {
    criar(data: { tipo: string; resultado: string; aeronaveId: number }) {
        return prisma.teste.create({ data })
    }

    atualizar(id: number, resultado: string) {
        return prisma.teste.update({ where: { id }, data: { resultado } })
    }
}