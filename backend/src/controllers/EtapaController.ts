import { Request, Response } from "express"
import { EtapaService } from "../services/EtapaService"

const service = new EtapaService()

export class EtapaController {
    async criar(req: Request, res: Response) {
        try {
            const codigo = String(req.params.codigo)
            const etapa = await service.criar(codigo, req.body)
            res.status(201).json(etapa)
        } catch (e: any) {
            res.status(400).json({ erro: e.message })
        }
    }

    async iniciar(req: Request, res: Response) {
        try {
            const codigo = String(req.params.codigo)
            const etapa = await service.iniciar(codigo, Number(req.params.etapaId))
            res.json(etapa)
        } catch (e: any) {
            res.status(400).json({ erro: e.message })
        }
    }

    async finalizar(req: Request, res: Response) {
        try {
            const etapa = await service.finalizar(Number(req.params.etapaId))
            res.json(etapa)
        } catch (e: any) {
            res.status(400).json({ erro: e.message })
        }
    }
}