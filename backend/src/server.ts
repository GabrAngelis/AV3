import express from "express"
import cors from "cors"
import { prisma } from "./config/prisma"

const app = express()

app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())

app.get("/aeronaves", async (req, res) => {
    const aeronaves = await prisma.aeronave.findMany({
        include: {
            pecas: true,
            etapas: true,
            testes: true
        }
    })
    res.json(aeronaves)
})

app.post("/aeronaves", async (req, res) => {
    const { codigo, modelo, tipo, capacidade, alcance } = req.body

    const existe = await prisma.aeronave.findUnique({ where: { codigo } })
    if (existe) {
        return res.status(409).json({ erro: "Já existe uma aeronave com esse código." })
    }

    const aeronave = await prisma.aeronave.create({
        data: { codigo, modelo, tipo, capacidade, alcance }
    })

    res.status(201).json(aeronave)
})

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000")
})