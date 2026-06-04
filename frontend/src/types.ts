import { NivelPermissao } from "./enums/nivelPermissao"
import { StatusEtapa } from "./enums/statusEtapa"
import { StatusPeca } from "./enums/statusPeca"
import { TipoAeronave } from "./enums/tipoAeronave"
import { TipoPeca } from "./enums/tipoPeca"
import { TipoTeste } from "./enums/tipoTeste"
import { ResultadoTeste } from "./enums/resultadoTeste"

export interface Funcionario {
  id: string
  nome: string
  telefone: string
  endereco: string
  usuario: string
  senha: string
  nivelPermissao: NivelPermissao
}

export interface Peca {
  id: number
  nome: string
  tipo: string
  fornecedor: string
  status: string
}

export interface Etapa {
  id: number
  nome: string
  prazo: string
  status: string
  funcionarios: Funcionario[]
}

export interface Teste {
  id: number
  tipo: string
  resultado: string
}

export interface Aeronave {
  id?: number
  codigo: string
  modelo: string
  tipo: string
  capacidade: number
  alcance: number
  pecas: Peca[]
  etapas: Etapa[]
  testes: Teste[]
}