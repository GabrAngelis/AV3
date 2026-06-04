import { Request, Response } from "express"
import { RelatorioService } from "../services/RelatorioService"

const service = new RelatorioService()

export class RelatorioController {
    async listar(req: Request, res: Response) {
        const dados = await service.listar()
        res.json(dados)
    }

    async gerar(req: Request, res: Response) {
        try {
            const relatorio = await service.gerar(req.body.cliente, req.body.aeronaveCodigo)
            res.status(201).json(relatorio)
        } catch (e: any) {
            res.status(400).json({ erro: e.message })
        }
    }
}