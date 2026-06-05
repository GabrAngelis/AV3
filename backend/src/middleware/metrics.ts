import { Request, Response, NextFunction } from "express"
import * as fs from "fs"
import * as path from "path"

const logPath = path.join(process.cwd(),"../logs/metrics.json")

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
    const inicio = Date.now()

    res.on("finish", () => {
        const processamento = Date.now() - inicio

        const log = {
            metodo: req.method,
            rota: req.path,
            status: res.statusCode,
            processamento_ms: processamento,
            timestamp: new Date().toISOString()
        }

        console.log(`[METRICS] ${log.metodo} ${log.rota} → ${log.processamento_ms}ms | status: ${log.status}`)

        const dir = path.dirname(logPath)
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

        let logs: any[] = []
        if (fs.existsSync(logPath)) {
            try { logs = JSON.parse(fs.readFileSync(logPath, "utf-8")) }
            catch { logs = [] }
        }

        logs.push(log)
        fs.writeFileSync(logPath, JSON.stringify(logs, null, 2))
    })

    next()
}