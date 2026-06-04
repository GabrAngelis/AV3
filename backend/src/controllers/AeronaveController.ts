import { Request, Response } from "express"
import { AeronaveService } from "../services/AeronaveService"

const service = new AeronaveService()

export class AeronaveController {
    async listar(req: Request, res: Response) {
        const dados = await service.listar()
        res.json(dados)
    }

    async criar(req: Request, res: Response) {
        try {
            const aeronave = await service.criar(req.body)
            res.status(201).json(aeronave)
        } catch (e: any) {
            res.status(409).json({ erro: e.message })
        }
    }
}