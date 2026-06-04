import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useApp } from "../context/AppContext"
import { TipoAeronave } from "../enums/tipoAeronave"
import type { Aeronave } from "../types"

export default function Producao() {
  const { aeronaves, adicionarAeronave, carregarAeronaves } = useApp()
  const navigate = useNavigate()

  const [mostrarForm, setMostrarForm] = useState(false)
  const [erro, setErro] = useState("")

  const [codigo, setCodigo] = useState("")
  const [modelo, setModelo] = useState("")
  const [tipo, setTipo] = useState<TipoAeronave>(TipoAeronave.COMERCIAL)
  const [capacidade, setCapacidade] = useState("")
  const [alcance, setAlcance] = useState("")

  useEffect(() => {
    carregarAeronaves()
  }, [])

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault()
    setErro("")

    if (!codigo || !modelo || !capacidade || !alcance) {
      setErro("Preencha todos os campos.")
      return
    }

    const nova: Aeronave = {
      codigo,
      modelo,
      tipo,
      capacidade: Number(capacidade),
      alcance: Number(alcance),
      pecas: [],
      etapas: [],
      testes: []
    }

    try {
      await adicionarAeronave(nova)
      setCodigo("")
      setModelo("")
      setTipo(TipoAeronave.COMERCIAL)
      setCapacidade("")
      setAlcance("")
      setMostrarForm(false)
    } catch (e: any) {
      setErro(e.message)
    }
  }

  return (
    <div>
      <h1>Produção</h1>

      <button onClick={() => navigate("/dashboard")}>Voltar ao Dashboard</button>
      <button onClick={() => setMostrarForm(!mostrarForm)}>
        {mostrarForm ? "Cancelar" : "Nova Aeronave"}
      </button>

      {mostrarForm && (
        <form onSubmit={handleCriar}>
          <h2>Nova Aeronave</h2>

          <div>
            <label>Código</label>
            <input value={codigo} onChange={e => setCodigo(e.target.value)} />
          </div>

          <div>
            <label>Modelo</label>
            <input value={modelo} onChange={e => setModelo(e.target.value)} />
          </div>

          <div>
            <label>Tipo</label>
            <select value={tipo} onChange={e => setTipo(e.target.value as TipoAeronave)}>
              <option value={TipoAeronave.COMERCIAL}>Comercial</option>
              <option value={TipoAeronave.MILITAR}>Militar</option>
            </select>
          </div>

          <div>
            <label>Capacidade</label>
            <input type="number" value={capacidade} onChange={e => setCapacidade(e.target.value)} />
          </div>

          <div>
            <label>Alcance (km)</label>
            <input type="number" value={alcance} onChange={e => setAlcance(e.target.value)} />
          </div>

          {erro && <p style={{ color: "red" }}>{erro}</p>}

          <button type="submit">Criar</button>
        </form>
      )}

      <hr />

      <h2>Aeronaves Cadastradas</h2>

      {aeronaves.length === 0 && <p>Nenhuma aeronave cadastrada.</p>}

      {aeronaves.map(a => (
        <div key={a.codigo} style={{ border: "1px solid #ccc", margin: "8px 0", padding: "8px" }}>
          <strong>{a.codigo}</strong> — {a.modelo} | {a.tipo} | Capacidade: {a.capacidade} | Alcance: {a.alcance} km
          <br />
          <button onClick={() => navigate(`/aeronave/${a.codigo}`)}>Ver Detalhes</button>
        </div>
      ))}
    </div>
  )
}