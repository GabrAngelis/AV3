import { FuncionarioRepository } from "../repositories/FuncionarioRepository"
import jwt from "jsonwebtoken"

const repo = new FuncionarioRepository()

export class FuncionarioService {
    listar() {
        return repo.listar()
    }

    async criar(data: { id: string; nome: string; telefone: string; endereco: string; usuario: string; senha: string; nivelPermissao: string }) {
        const existe = await repo.buscarPorUsuario(data.usuario)
        if (existe) throw new Error("Usuário já existe.")
        return repo.criar(data)
    }

    async login(usuario: string, senha: string) {
        const funcionario = await repo.buscarPorUsuario(usuario)
        if (!funcionario || funcionario.senha !== senha) {
            throw new Error("Usuário ou senha inválidos.")
        }

        const token = jwt.sign(
            { id: funcionario.id, nome: funcionario.nome, nivelPermissao: funcionario.nivelPermissao },
            process.env.JWT_SECRET as string,
            { expiresIn: "8h" }
        )

        return { token, funcionario }
    }
}