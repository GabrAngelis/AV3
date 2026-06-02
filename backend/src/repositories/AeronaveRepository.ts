import { prisma } from "../config/prisma";

export class AeronaveRepository {

    async listar() {
        return prisma.aeronave.findMany();
    }

}