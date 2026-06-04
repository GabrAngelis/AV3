import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import type { Funcionario, Aeronave } from "../types"

const API = "http://localhost:3000"

export interface Relatorio {
  id: number
  cliente: string
  dataEntrega: string
  aeronaveCodigo: string
  detalhes: string
}

interface AppContextType {
  usuarioLogado: Funcionario | null
  funcionarios: Funcionario[]
  aeronaves: Aeronave[]
  relatorios: Relatorio[]
  login: (usuario: string, senha: string) => Promise<void>
  logout: () => void
  carregarAeronaves: () => Promise<void>
  adicionarAeronave: (a: Aeronave) => Promise<void>
  atualizarAeronave: (codigo: string) => Promise<void>
  adicionarPeca: (codigoAeronave: string, peca: any) => Promise<void>
  avancarStatusPeca: (codigoAeronave: string, pecaId: number) => Promise<void>
  criarEtapa: (codigoAeronave: string, etapa: any) => Promise<void>
  iniciarEtapa: (codigoAeronave: string, etapaId: number) => Promise<void>
  finalizarEtapa: (codigoAeronave: string, etapaId: number) => Promise<void>
  adicionarTeste: (codigoAeronave: string, teste: any) => Promise<void>
  carregarRelatorios: () => Promise<void>
  gerarRelatorio: (cliente: string, aeronaveCodigo: string) => Promise<void>
  adicionarFuncionario: (f: Funcionario) => Promise<void>
  carregarFuncionarios: () => Promise<void>
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [usuarioLogado, setUsuarioLogado] = useState<Funcionario | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([])
  const [relatorios, setRelatorios] = useState<Relatorio[]>([])

  // Monta os headers com Authorization quando há token
  function headers(comBody = false): HeadersInit {
    const h: Record<string, string> = {}
    if (comBody) h["Content-Type"] = "application/json"
    if (token) h["Authorization"] = `Bearer ${token}`
    return h
  }

  async function login(usuario: string, senha: string) {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, senha })
    })

    if (!res.ok) throw new Error("Usuário ou senha inválidos.")

    const data = await res.json()

    // Salva o token e o funcionário logado
    setToken(data.token)
    setUsuarioLogado(data.funcionario)
  }

  function logout() {
    setToken(null)
    setUsuarioLogado(null)
    setAeronaves([])
    setRelatorios([])
    setFuncionarios([])
  }

  // Carrega dados iniciais após login
  useEffect(() => {
    if (token) {
      carregarAeronaves()
      carregarRelatorios()
      carregarFuncionarios()
    }
  }, [token])

  async function carregarAeronaves() {
    const res = await fetch(`${API}/aeronaves`, { headers: headers() })
    if (!res.ok) return
    const data = await res.json()
    setAeronaves(data)
  }

  async function adicionarAeronave(a: Aeronave) {
    const res = await fetch(`${API}/aeronaves`, {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify(a)
    })
    if (!res.ok) {
      const erro = await res.json()
      throw new Error(erro.erro)
    }
    await carregarAeronaves()
  }

  async function atualizarAeronave(codigo: string) {
    await carregarAeronaves()
  }

  async function adicionarPeca(codigoAeronave: string, peca: any) {
    const res = await fetch(`${API}/aeronaves/${codigoAeronave}/pecas`, {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify(peca)
    })
    if (!res.ok) {
      const erro = await res.json()
      throw new Error(erro.erro)
    }
    await carregarAeronaves()
  }

  async function avancarStatusPeca(codigoAeronave: string, pecaId: number) {
    const res = await fetch(`${API}/aeronaves/${codigoAeronave}/pecas/${pecaId}`, {
      method: "PATCH",
      headers: headers()
    })
    if (!res.ok) {
      const erro = await res.json()
      throw new Error(erro.erro)
    }
    await carregarAeronaves()
  }

  async function criarEtapa(codigoAeronave: string, etapa: any) {
    const res = await fetch(`${API}/aeronaves/${codigoAeronave}/etapas`, {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify(etapa)
    })
    if (!res.ok) {
      const erro = await res.json()
      throw new Error(erro.erro)
    }
    await carregarAeronaves()
  }

  async function iniciarEtapa(codigoAeronave: string, etapaId: number) {
    const res = await fetch(`${API}/aeronaves/${codigoAeronave}/etapas/${etapaId}/iniciar`, {
      method: "PATCH",
      headers: headers()
    })
    if (!res.ok) {
      const erro = await res.json()
      throw new Error(erro.erro)
    }
    await carregarAeronaves()
  }

  async function finalizarEtapa(codigoAeronave: string, etapaId: number) {
    const res = await fetch(`${API}/aeronaves/${codigoAeronave}/etapas/${etapaId}/finalizar`, {
      method: "PATCH",
      headers: headers()
    })
    if (!res.ok) {
      const erro = await res.json()
      throw new Error(erro.erro)
    }
    await carregarAeronaves()
  }

  async function adicionarTeste(codigoAeronave: string, teste: any) {
    const res = await fetch(`${API}/aeronaves/${codigoAeronave}/testes`, {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify(teste)
    })
    if (!res.ok) {
      const erro = await res.json()
      throw new Error(erro.erro)
    }
    await carregarAeronaves()
  }

  async function carregarRelatorios() {
    const res = await fetch(`${API}/relatorios`, { headers: headers() })
    if (!res.ok) return
    const data = await res.json()
    setRelatorios(data.map((r: any) => ({
      id: r.id,
      cliente: r.cliente,
      dataEntrega: r.dataEntrega,
      aeronaveCodigo: r.aeronave.codigo,
      detalhes: r.detalhes
    })))
  }

  async function gerarRelatorio(cliente: string, aeronaveCodigo: string) {
    const res = await fetch(`${API}/relatorios`, {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify({ cliente, aeronaveCodigo })
    })
    if (!res.ok) {
      const erro = await res.json()
      throw new Error(erro.erro)
    }
    await carregarRelatorios()
  }

  async function adicionarFuncionario(f: Funcionario) {
    const res = await fetch(`${API}/funcionarios`, {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify(f)
    })
    if (!res.ok) {
      const erro = await res.json()
      throw new Error(erro.erro)
    }
    await carregarFuncionarios()
  }

  async function carregarFuncionarios() {
    const res = await fetch(`${API}/funcionarios`, { headers: headers() })
    if (!res.ok) return
    const data = await res.json()
    setFuncionarios(data)
  }

  return (
    <AppContext.Provider value={{
      usuarioLogado, funcionarios, aeronaves, relatorios,
      login, logout, carregarAeronaves, adicionarAeronave, atualizarAeronave,
      adicionarPeca, avancarStatusPeca, criarEtapa, iniciarEtapa, finalizarEtapa,
      adicionarTeste, carregarRelatorios, gerarRelatorio, adicionarFuncionario,
      carregarFuncionarios
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp fora do AppProvider")
  return ctx
}