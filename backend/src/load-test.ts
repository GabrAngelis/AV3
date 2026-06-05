import autocannon from "autocannon"
import * as fs from "fs"
import * as path from "path"

const BASE_URL = "http://localhost:3000"
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJub21lIjoiQWRtaW4iLCJuaXZlbFBlcm1pc3NhbyI6IkFETUlOSVNUUkFET1IiLCJpYXQiOjE3ODA2MTc3MTEsImV4cCI6MTc4MDY0NjUxMX0.CL3BcIUbuQZQUrZjZAlk7B339odc00m46cZT7Tpjkp4"

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
            if (err) {
                console.error("Erro no teste:", err)
                resolve(null)
                return
            }
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

        const resultado = await rodarTeste(conexoes)

        if (resultado) {
            const resumo = {
                usuarios: conexoes,
                latencia_media_ms: resultado.latency.mean,
                latencia_p50_ms: resultado.latency.p50,
                latencia_p99_ms: resultado.latency.p99,
                tempo_resposta_medio_ms: resultado.latency.mean,
                requisicoes_total: resultado.requests.total,
                requisicoes_por_segundo: resultado.requests.average,
                erros: resultado.errors,
                timeouts: resultado.timeouts
            }

            resultados.push(resumo)

            console.log(`✓ Latência média:     ${resumo.latencia_media_ms} ms`)
            console.log(`✓ Latência p50:       ${resumo.latencia_p50_ms} ms`)
            console.log(`✓ Latência p99:       ${resumo.latencia_p99_ms} ms`)
            console.log(`✓ Tempo de resposta:  ${resumo.tempo_resposta_medio_ms} ms`)
            console.log(`✓ Requisições/s:      ${resumo.requisicoes_por_segundo}`)
            console.log(`✓ Total requisições:  ${resumo.requisicoes_total}`)
            console.log(`✓ Erros:              ${resumo.erros}`)
        }

        await new Promise(r => setTimeout(r, 2000))
    }

    const outputPath = path.join(__dirname, "../../logs/load-test-results.json")
    const dir = path.dirname(outputPath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

    fs.writeFileSync(outputPath, JSON.stringify(resultados, null, 2))

    console.log("\n=============================")
    console.log("RESUMO FINAL")
    console.log("=============================")
    console.log("\nUsuários | Latência Média | p99    | Req/s")
    console.log("---------|----------------|--------|------")
    resultados.forEach(r => {
        console.log(
            `${String(r.usuarios).padEnd(9)}| ${String(r.latencia_media_ms).padEnd(15)} | ${String(r.latencia_p99_ms).padEnd(7)}| ${r.requisicoes_por_segundo}`
        )
    })

    console.log(`\nResultados salvos em: ${outputPath}`)
}

main().catch(console.error)