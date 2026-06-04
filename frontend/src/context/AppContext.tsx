import { createContext, useContext, useState, ReactNode } from "react"
import { NivelPermissao } from "../enums/nivelPermissao"
import type { Funcionario, Aeronave } from "../types"

const API = "http://localhost:3000"

export interface Relatorio {
  id: number
  cliente: string
  dataEntrega: string
  aeronaveCodigo: string
  detalhes: string
}

const seedFuncionarios: Funcionario[] = [
  { id: "1", nome: "Admin", telefone: "123456789", endereco: "Rua dos admin, 1", usuario: "admin", senha: "admin123", nivelPermissao: NivelPermissao.ADMINISTRADOR },
  { id: "2", nome: "Engenheiro", telefone: "987654321", endereco: "Rua dos engenheiros, 2", usuario: "engenheiro", senha: "eng123", nivelPermissao: NivelPermissao.ENGENHEIRO },
  { id: "3", nome: "Operador", telefone: "111111111", endereco: "Rua dos operadores, 3", usuario: "operador", senha: "op123", nivelPermissao: NivelPermissao.OPERADOR },
]

interface AppContextType {
  usuarioLogado: Funcionario | null
  funcionarios: Funcionario[]
  aeronaves: Aeronave[]
  relatorios: Relatorio[]
  login: (usuario: string, senha: string) => void
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
  adicionarFuncionario: (f: Funcionario) => void
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [usuarioLogado, setUsuarioLogado] = useState<Funcionario | null>(null)
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(seedFuncionarios)
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([])
  const [relatorios, setRelatorios] = useState<Relatorio[]>([])

  function login(usuario: string, senha: string) {
    const encontrado = funcionarios.find(f => f.usuario === usuario && f.senha === senha)
    if (!encontrado) throw new Error("Usuário ou senha inválidos.")
    setUsuarioLogado(encontrado)
  }

  function logout() {
    setUsuarioLogado(null)
  }

  async function carregarAeronaves() {
    const res = await fetch(`${API}/aeronaves`)
    const data = await res.json()
    setAeronaves(data)
  }

  async function adicionarAeronave(a: Aeronave) {
    const res = await fetch(`${API}/aeronaves`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
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
      method: "PATCH"
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
      headers: { "Content-Type": "application/json" },
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
      method: "PATCH"
    })
    if (!res.ok) {
      const erro = await res.json()
      throw new Error(erro.erro)
    }
    await carregarAeronaves()
  }

  async function finalizarEtapa(codigoAeronave: string, etapaId: number) {
    const res = await fetch(`${API}/aeronaves/${codigoAeronave}/etapas/${etapaId}/finalizar`, {
      method: "PATCH"
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(teste)
    })
    if (!res.ok) {
      const erro = await res.json()
      throw new Error(erro.erro)
    }
    await carregarAeronaves()
  }

  async function carregarRelatorios() {
    const res = await fetch(`${API}/relatorios`)
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cliente, aeronaveCodigo })
    })
    if (!res.ok) {
      const erro = await res.json()
      throw new Error(erro.erro)
    }
    await carregarRelatorios()
  }

  function adicionarFuncionario(f: Funcionario) {
    const existe = funcionarios.find(func => func.usuario === f.usuario)
    if (existe) throw new Error("Usuário já existe.")
    setFuncionarios(prev => [...prev, f])
  }

  return (
    <AppContext.Provider value={{
      usuarioLogado, funcionarios, aeronaves, relatorios,
      login, logout, carregarAeronaves, adicionarAeronave, atualizarAeronave,
      adicionarPeca, avancarStatusPeca, criarEtapa, iniciarEtapa, finalizarEtapa,
      adicionarTeste, carregarRelatorios, gerarRelatorio, adicionarFuncionario
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