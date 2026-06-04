import { prisma } from "../config/prisma"

export class FuncionarioRepository {
    listar() {
        return prisma.funcionario.findMany()
    }

    buscarPorUsuario(usuario: string) {
        return prisma.funcionario.findUnique({ where: { usuario } })
    }

    criar(data: { id: string; nome: string; telefone: string; endereco: string; usuario: string; senha: string; nivelPermissao: string }) {
        return prisma.funcionario.create({ data })
    }
}