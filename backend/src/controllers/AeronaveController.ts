import { Request, Response } from "express";
import { AeronaveService } from "../services/AeronaveService";

const service = new AeronaveService();

export class AeronaveController {

    async listar(req: Request, res: Response) {

        const dados = await service.listar();

        return res.json(dados);

    }

}