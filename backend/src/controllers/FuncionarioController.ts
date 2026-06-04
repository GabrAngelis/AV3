import { Request, Response } from "express"
import { FuncionarioService } from "../services/FuncionarioService"

const service = new FuncionarioService()

export class FuncionarioController {
    async listar(req: Request, res: Response) {
        const dados = await service.listar()
        res.json(dados)
    }

    async criar(req: Request, res: Response) {
        try {
            const funcionario = await service.criar(req.body)
            res.status(201).json(funcionario)
        } catch (e: any) {
            res.status(409).json({ erro: e.message })
        }
    }

    async login(req: Request, res: Response) {
        try {
            const resultado = await service.login(req.body.usuario, req.body.senha)
            res.json(resultado)
        } catch (e: any) {
            res.status(401).json({ erro: e.message })
        }
    }
}