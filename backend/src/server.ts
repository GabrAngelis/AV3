import express from "express";
import { prisma } from "./config/prisma";

const app = express();

app.use(express.json());

app.get("/aeronaves", async (req, res) => {
    const aeronaves = await prisma.aeronave.findMany();

    res.json(aeronaves);
});

app.post("/aeronaves", async (req, res) => {

    const {
        codigo,
        modelo,
        tipo,
        capacidade,
        alcance
    } = req.body;

    const aeronave = await prisma.aeronave.create({
        data: {
            codigo,
            modelo,
            tipo,
            capacidade,
            alcance
        }
    });

    res.status(201).json(aeronave);
});

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});