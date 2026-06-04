import { prisma } from "../config/prisma"

export class AeronaveRepository {
    listar() {
        return prisma.aeronave.findMany({
            include: { pecas: true, etapas: true, testes: true }
        })
    }

    buscarPorCodigo(codigo: string) {
        return prisma.aeronave.findUnique({
            where: { codigo },
            include: { pecas: true, etapas: true, testes: true }
        })
    }

    criar(data: { codigo: string; modelo: string; tipo: string; capacidade: number; alcance: number }) {
        return prisma.aeronave.create({
            data: {
                codigo: data.codigo,
                modelo: data.modelo,
                tipo: data.tipo,
                capacidade: data.capacidade,
                alcance: data.alcance
            }
        })
    }
}