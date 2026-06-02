import { AeronaveRepository } from "../repositories/AeronaveRepository";

export class AeronaveService {

    private repository = new AeronaveRepository();

    async listar() {
        return this.repository.listar();
    }

}