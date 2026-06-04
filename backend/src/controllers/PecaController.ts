import { Request, Response } from "express"
import { PecaService } from "../services/PecaService"

const service = new PecaService()

export class PecaController {
    async adicionar(req: Request, res: Response) {
        try {
            const codigo = String(req.params.codigo)
            const peca = await service.adicionar(codigo, req.body)
            res.status(201).json(peca)
        } catch (e: any) {
            res.status(400).json({ erro: e.message })
        }
    }

    async avancarStatus(req: Request, res: Response) {
        try {
            const peca = await service.avancarStatus(Number(req.params.pecaId))
            res.json(peca)
        } catch (e: any) {
            res.status(400).json({ erro: e.message })
        }
    }
}