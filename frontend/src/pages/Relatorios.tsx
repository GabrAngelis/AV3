import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../context/AppContext"

export default function Relatorios() {
  const { aeronaves, relatorios, carregarAeronaves, carregarRelatorios, gerarRelatorio } = useApp()
  const navigate = useNavigate()

  const [codigoSelecionado, setCodigoSelecionado] = useState("")
  const [cliente, setCliente] = useState("")
  const [erro, setErro] = useState("")
  const [relatorioVisivel, setRelatorioVisivel] = useState<number | null>(null)

  useEffect(() => {
    carregarAeronaves()
    carregarRelatorios()
  }, [])

  async function handleGerar(e: React.FormEvent) {
    e.preventDefault()
    setErro("")

    if (!codigoSelecionado || !cliente) {
      setErro("Preencha todos os campos.")
      return
    }

    try {
      await gerarRelatorio(cliente, codigoSelecionado)
      setCliente("")
      setCodigoSelecionado("")
    } catch (e: any) {
      setErro(e.message)
    }
  }

  return (
    <div>
      <h1>Relatórios</h1>
      <button onClick={() => navigate("/dashboard")}>Voltar ao Dashboard</button>

      <hr />

      <h2>Gerar Relatório</h2>
      <form onSubmit={handleGerar}>
        <div>
          <label>Aeronave</label>
          <select value={codigoSelecionado} onChange={e => setCodigoSelecionado(e.target.value)}>
            <option value="">Selecione...</option>
            {aeronaves.map(a => (
              <option key={a.codigo} value={a.codigo}>{a.codigo} — {a.modelo}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Cliente</label>
          <input value={cliente} onChange={e => setCliente(e.target.value)} />
        </div>
        {erro && <p style={{ color: "red" }}>{erro}</p>}
        <button type="submit">Gerar</button>
      </form>

      <hr />

      <h2>Relatórios Gerados</h2>

      {relatorios.length === 0 && <p>Nenhum relatório gerado.</p>}

      {relatorios.map(r => (
        <div key={r.id} style={{ border: "1px solid #ccc", margin: "8px 0", padding: "8px" }}>
          <strong>Relatório #{r.id}</strong> | Aeronave: {r.aeronaveCodigo} | Cliente: {r.cliente} | Data: {r.dataEntrega}
          <br />
          <button onClick={() => setRelatorioVisivel(relatorioVisivel === r.id ? null : r.id)}>
            {relatorioVisivel === r.id ? "Fechar" : "Ver Detalhes"}
          </button>
          {relatorioVisivel === r.id && (
            <pre style={{ background: "#f4f4f4", padding: "8px", marginTop: "8px" }}>
              {r.detalhes}
            </pre>
          )}
        </div>
      ))}
    </div>
  )
}