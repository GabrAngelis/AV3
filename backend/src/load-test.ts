import autocannon from "autocannon"
import * as fs from "fs"
import * as path from "path"

const BASE_URL = "http://localhost:3000"
const TOKEN = "SEU-TOKEN-AQUI"
const logPath = path.join(__dirname, "../../logs/metrics.json")

function limparLogs() {
    if (fs.existsSync(logPath)) fs.unlinkSync(logPath)
}

function calcularMediaProcessamento(): number {
    if (!fs.existsSync(logPath)) return 0
    try {
        const logs: any[] = JSON.parse(fs.readFileSync(logPath, "utf-8"))
        const apenas200 = logs.filter(l => l.status === 200 && l.rota === "/aeronaves")
        if (apenas200.length === 0) return 0
        const soma = apenas200.reduce((acc, l) => acc + l.processamento_ms, 0)
        return Math.round((soma / apenas200.length) * 100) / 100
    } catch {
        return 0
    }
}

async function rodarTeste(conexoes: number, duracao: number = 5): Promise<any> {
    return new Promise((resolve) => {
        const instance = autocannon({
            url: `${BASE_URL}/aeronaves`,
            connections: conexoes,
            duration: duracao,
            headers: {
                "Authorization": `Bearer ${TOKEN}`,
                "Content-Type": "application/json"
            }
        }, (err: Error | null, result: any) => {
            if (err) { resolve(null); return }
            resolve(result)
        })

        autocannon.track(instance, { renderProgressBar: true })
    })
}

async function main() {
    console.log("\n=============================")
    console.log("  TESTE DE CARGA — AEROCODE  ")
    console.log("=============================\n")

    const cenarios = [1, 5, 10]
    const resultados: any[] = []

    for (const conexoes of cenarios) {
        console.log(`\n--- Cenário: ${conexoes} usuário(s) simultâneo(s) ---`)

        // Limpa logs antes de cada cenário para medir só esse cenário
        limparLogs()

        const resultado = await rodarTeste(conexoes)

        if (resultado) {
            // Tempo de resposta total (round-trip) medido pelo autocannon
            const tempoResposta = Math.round(resultado.latency.mean * 100) / 100

            // Tempo de processamento medido pelo middleware no servidor
            const processamento = calcularMediaProcessamento()

            // Latência de rede = resposta total - processamento
            const latencia = Math.round((tempoResposta - processamento) * 100) / 100

            const resumo = {
                usuarios: conexoes,
                latencia_ms: latencia > 0 ? latencia : 1,
                processamento_ms: processamento,
                tempo_resposta_ms: tempoResposta,
                latencia_p99_ms: resultado.latency.p99,
                requisicoes_total: resultado.requests.total,
                requisicoes_por_segundo: resultado.requests.average,
                erros: resultado.errors
            }

            resultados.push(resumo)

            console.log(`\n  Métricas do cenário ${conexoes} usuário(s):`)
            console.log(`  ┌─────────────────────────────────────┐`)
            console.log(`  │ Latência de rede:      ${String(resumo.latencia_ms).padEnd(10)} ms │`)
            console.log(`  │ Tempo de processamento:${String(resumo.processamento_ms).padEnd(10)} ms │`)
            console.log(`  │ Tempo de resposta:     ${String(resumo.tempo_resposta_ms).padEnd(10)} ms │`)
            console.log(`  │ Requisições/s:         ${String(resumo.requisicoes_por_segundo).padEnd(10)}    │`)
            console.log(`  │ Total requisições:     ${String(resumo.requisicoes_total).padEnd(10)}    │`)
            console.log(`  │ Erros:                 ${String(resumo.erros).padEnd(10)}    │`)
            console.log(`  └─────────────────────────────────────┘`)
        }

        await new Promise(r => setTimeout(r, 2000))
    }

    // Salva resultados
    const outputPath = path.join(__dirname, "../../logs/load-test-results.json")
    const dir = path.dirname(outputPath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(outputPath, JSON.stringify(resultados, null, 2))

    console.log("\n=============================")
    console.log("RESUMO FINAL")
    console.log("=============================")
    console.log("\nUsuários | Latência  | Processamento | Resposta  | Req/s")
    console.log("---------|-----------|---------------|-----------|------")
    resultados.forEach(r => {
        console.log(
            `${String(r.usuarios).padEnd(9)}| ${String(r.latencia_ms + " ms").padEnd(10)}| ${String(r.processamento_ms + " ms").padEnd(14)} | ${String(r.tempo_resposta_ms + " ms").padEnd(10)}| ${r.requisicoes_por_segundo}`
        )
    })

    console.log(`\nResultados salvos em: ${outputPath}`)
}

main().catch(console.error)