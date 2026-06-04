import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import router from "./routes/index"

dotenv.config()

const app = express()

app.use(cors({ origin: "http://localhost:5173" }))
app.use(express.json())
app.use(router)

app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000")
})