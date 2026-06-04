import { useParams, useNavigate } from "react-router-dom"
import { useApp } from "../context/AppContext"
import { useState } from "react"
import { TipoPeca } from "../enums/tipoPeca"
import { StatusPeca } from "../enums/statusPeca"
import { StatusEtapa } from "../enums/statusEtapa"
import { TipoTeste } from "../enums/tipoTeste"
import { ResultadoTeste } from "../enums/resultadoTeste"
import type { Aeronave, Peca, Etapa, Teste } from "../types"

function statusPecaBadge(status: StatusPeca) {
  if (status === StatusPeca.PRONTA) return "badge badge-green"
  if (status === StatusPeca.EM_TRANSPORTE) return "badge badge-yellow"
  return "badge badge-blue"
}

function statusEtapaBadge(status: StatusEtapa) {
  if (status === StatusEtapa.CONCLUIDA) return "badge badge-green"
  if (status === StatusEtapa.ANDAMENTO) return "badge badge-yellow"
  return "badge badge-blue"
}

function resultadoBadge(resultado: ResultadoTeste) {
  return resultado === ResultadoTeste.APROVADO ? "badge badge-green" : "badge badge-red"
}

export default function DetalhesAeronave() {
  const { codigo } = useParams()
  const {
    aeronaves,
    adicionarPeca,
    avancarStatusPeca,
    criarEtapa,
    iniciarEtapa,
    finalizarEtapa,
    adicionarTeste
  } = useApp()
  const navigate = useNavigate()

  const aeronave = aeronaves.find(a => a.codigo === codigo)

  const [erro, setErro] = useState("")

  // Estados peça
  const [nomePeca, setNomePeca] = useState("")
  const [tipoPeca, setTipoPeca] = useState<TipoPeca>(TipoPeca.NACIONAL)
  const [fornecedor, setFornecedor] = useState("")
  const [mostrarFormPeca, setMostrarFormPeca] = useState(false)

  // Estados etapa
  const [nomeEtapa, setNomeEtapa] = useState("")
  const [prazoEtapa, setPrazoEtapa] = useState("")
  const [mostrarFormEtapa, setMostrarFormEtapa] = useState(false)

  // Estados teste
  const [tipoTeste, setTipoTeste] = useState<TipoTeste>(TipoTeste.ELETRICO)
  const [resultadoTeste, setResultadoTeste] = useState<ResultadoTeste>(ResultadoTeste.APROVADO)
  const [mostrarFormTeste, setMostrarFormTeste] = useState(false)

  if (!aeronave) return (
    <div className="page-wrapper">
      <div className="access-denied">
        <p>Aeronave não encontrada.</p>
        <button onClick={() => navigate("/producao")}>Voltar</button>
      </div>
    </div>
  )


  // Peças

async function handleAdicionarPeca(e: React.FormEvent) {
  e.preventDefault()
  setErro("")

  if (!nomePeca || !fornecedor) {
    setErro("Preencha todos os campos da peça.")
    return
  }

  try {
    await adicionarPeca(aeronave.codigo, {
      nome: nomePeca,
      tipo: tipoPeca,
      fornecedor
    })

    setNomePeca("")
    setFornecedor("")
    setTipoPeca(TipoPeca.NACIONAL)
    setMostrarFormPeca(false)
  } catch (err: any) {
    setErro(err.message)
  }
}

async function handleAtualizarStatusPeca(id: number) {
  setErro("")

  try {
    await avancarStatusPeca(aeronave.codigo, id)
  } catch (err: any) {
    setErro(err.message)
  }
}

  // Etapas

async function handleCriarEtapa(e: React.FormEvent) {
  e.preventDefault()
  setErro("")

  if (!nomeEtapa || !prazoEtapa) {
    setErro("Preencha todos os campos da etapa.")
    return
  }

  try {
    await criarEtapa(aeronave.codigo, {
      nome: nomeEtapa,
      prazo: prazoEtapa
    })

    setNomeEtapa("")
    setPrazoEtapa("")
    setMostrarFormEtapa(false)
  } catch (err: any) {
    setErro(err.message)
  }
}

async function handleIniciarEtapa(id: number) {
  setErro("")

  try {
    await iniciarEtapa(aeronave.codigo, id)
  } catch (err: any) {
    setErro(err.message)
  }
}

async function handleFinalizarEtapa(id: number) {
  setErro("")

  try {
    await finalizarEtapa(aeronave.codigo, id)
  } catch (err: any) {
    setErro(err.message)
  }
}

  // Testes

async function handleAdicionarTeste(e: React.FormEvent) {
  e.preventDefault()
  setErro("")

  try {
    await adicionarTeste(aeronave.codigo, {
      tipo: tipoTeste,
      resultado: resultadoTeste
    })

    setTipoTeste(TipoTeste.ELETRICO)
    setResultadoTeste(ResultadoTeste.APROVADO)
    setMostrarFormTeste(false)
  } catch (err: any) {
    setErro(err.message)
  }
}

  // Status final
  const tipos = Object.values(TipoTeste)
  const todosTestesRealizados = tipos.every(tipo => aeronave.testes.some(t => t.tipo === tipo))
  const todosTestesAprovados = aeronave.testes.every(t => t.resultado === ResultadoTeste.APROVADO)
  const statusFinal = todosTestesRealizados && todosTestesAprovados ? "APROVADA" : "REPROVADA"

  return (
    <div className="page-wrapper">
      <div className="btn-group">
        <button onClick={() => navigate("/producao")}>Voltar</button>
      </div>

      <div className="page-header">
        <h1>{aeronave.codigo} — {aeronave.modelo}</h1>
        <p>Tipo: {aeronave.tipo} &nbsp;|&nbsp; Capacidade: {aeronave.capacidade} &nbsp;|&nbsp; Alcance: {aeronave.alcance} km</p>
      </div>

      {erro && <p className="error">{erro}</p>}

      <hr />

      <h2>Peças</h2>
      <div className="btn-group">
        <button onClick={() => setMostrarFormPeca(!mostrarFormPeca)}>
          {mostrarFormPeca ? "Cancelar" : "Adicionar Peça"}
        </button>
      </div>

      {mostrarFormPeca && (
        <form onSubmit={handleAdicionarPeca}>
          <div>
            <label>Nome</label>
            <input value={nomePeca} onChange={e => setNomePeca(e.target.value)} />
          </div>
          <div>
            <label>Tipo</label>
            <select value={tipoPeca} onChange={e => setTipoPeca(e.target.value as TipoPeca)}>
              <option value={TipoPeca.NACIONAL}>Nacional</option>
              <option value={TipoPeca.IMPORTADA}>Importada</option>
            </select>
          </div>
          <div>
            <label>Fornecedor</label>
            <input value={fornecedor} onChange={e => setFornecedor(e.target.value)} />
          </div>
          <button type="submit">Adicionar</button>
        </form>
      )}

      {aeronave.pecas.length === 0
        ? <p>Nenhuma peça cadastrada.</p>
        : aeronave.pecas.map((p, i) => (
          <div key={i} className="list-item">
            <span>
              <strong>{p.nome}</strong> &nbsp;|&nbsp; {p.tipo} &nbsp;|&nbsp; {p.fornecedor}
              &nbsp;&nbsp;<span className={statusPecaBadge(p.status)}>{p.status}</span>
            </span>
            <button onClick={() => handleAtualizarStatusPeca(p.id)}disabled={p.status === "Pronta"}>Avançar status</button>
          </div>
        ))
      }
      <hr />

      <h2>Etapas</h2>
      <div className="btn-group">
        <button onClick={() => setMostrarFormEtapa(!mostrarFormEtapa)}>
          {mostrarFormEtapa ? "Cancelar" : "Criar Etapa"}
        </button>
      </div>

      {mostrarFormEtapa && (
        <form onSubmit={handleCriarEtapa}>
          <div>
            <label>Nome</label>
            <input value={nomeEtapa} onChange={e => setNomeEtapa(e.target.value)} />
          </div>
          <div>
            <label>Prazo</label>
            <input value={prazoEtapa} onChange={e => setPrazoEtapa(e.target.value)} />
          </div>
          <button type="submit">Criar</button>
        </form>
      )}

      {aeronave.etapas.length === 0
        ? <p>Nenhuma etapa cadastrada.</p>
        : aeronave.etapas.map((e, i) => (
          <div key={i} className="list-item">
            <span>
              <strong>{e.nome}</strong> &nbsp;|&nbsp; Prazo: {e.prazo}
              &nbsp;&nbsp;<span className={statusEtapaBadge(e.status)}>{e.status}</span>
            </span>
            <div className="btn-group" style={{ margin: 0 }}>
              <button onClick={() => handleIniciarEtapa(e.id)} disabled={e.status !== StatusEtapa.PENDENTE}>
                Iniciar
              </button>
              <button onClick={() => handleFinalizarEtapa(e.id)} disabled={e.status !== StatusEtapa.ANDAMENTO}>
                Finalizar
              </button>
            </div>
          </div>
        ))
      }

      <hr />

      <h2>Testes</h2>
      <div className="btn-group">
        <button onClick={() => setMostrarFormTeste(!mostrarFormTeste)}>
          {mostrarFormTeste ? "Cancelar" : "Adicionar Teste"}
        </button>
      </div>

      {mostrarFormTeste && (
        <form onSubmit={handleAdicionarTeste}>
          <div>
            <label>Tipo</label>
            <select value={tipoTeste} onChange={e => setTipoTeste(e.target.value as TipoTeste)}>
              <option value={TipoTeste.ELETRICO}>Elétrico</option>
              <option value={TipoTeste.HIDRAULICO}>Hidráulico</option>
              <option value={TipoTeste.AERODINAMICO}>Aerodinâmico</option>
            </select>
          </div>
          <div>
            <label>Resultado</label>
            <select value={resultadoTeste} onChange={e => setResultadoTeste(e.target.value as ResultadoTeste)}>
              <option value={ResultadoTeste.APROVADO}>Aprovado</option>
              <option value={ResultadoTeste.REPROVADO}>Reprovado</option>
            </select>
          </div>
          <button type="submit">Adicionar</button>
        </form>
      )}

      {aeronave.testes.length === 0
        ? <p>Nenhum teste realizado.</p>
        : aeronave.testes.map((t, i) => (
          <div key={i} className="list-item">
            <span><strong>{t.tipo}</strong></span>
            <span className={resultadoBadge(t.resultado)}>{t.resultado}</span>
          </div>
        ))
      }

      <hr />
      
      {todosTestesRealizados && (
        <div className="card" style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
            Status Final da Aeronave
          </p>
          <span className={`badge ${statusFinal === "APROVADA" ? "badge-green" : "badge-red"}`}
            style={{ fontSize: "1.1rem", padding: "8px 20px" }}>
            {statusFinal}
          </span>
        </div>
      )}
    </div>
  )
}
