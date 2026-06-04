import { AeronaveRepository } from "../repositories/AeronaveRepository"

const repo = new AeronaveRepository()

export class AeronaveService {
    listar() {
        return repo.listar()
    }

    async criar(data: { codigo: string; modelo: string; tipo: string; capacidade: number; alcance: number }) {
        const existe = await repo.buscarPorCodigo(data.codigo)
        if (existe) throw new Error("Já existe uma aeronave com esse código.")
        return repo.criar(data)
    }

    async buscar(codigo: string) {
        const aeronave = await repo.buscarPorCodigo(codigo)
        if (!aeronave) throw new Error("Aeronave não encontrada.")
        return aeronave
    }
}