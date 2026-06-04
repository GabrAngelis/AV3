import { Request, Response } from "express"
import { TesteService } from "../services/TesteService"

const service = new TesteService()

export class TesteController {
    async adicionar(req: Request, res: Response) {
        try {
            const codigo = String(req.params.codigo)
            const teste = await service.adicionar(codigo, req.body)
            res.status(201).json(teste)
        } catch (e: any) {
            res.status(400).json({ erro: e.message })
        }
    }
}