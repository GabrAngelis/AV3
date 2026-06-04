import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const usuarios = [
        { id: "1", nome: "Admin", telefone: "123456789", endereco: "Rua dos admin, 1", usuario: "admin", senha: "admin123", nivelPermissao: "ADMINISTRADOR" },
        { id: "2", nome: "Engenheiro", telefone: "987654321", endereco: "Rua dos engenheiros, 2", usuario: "engenheiro", senha: "eng123", nivelPermissao: "ENGENHEIRO" },
        { id: "3", nome: "Operador", telefone: "111111111", endereco: "Rua dos operadores, 3", usuario: "operador", senha: "op123", nivelPermissao: "OPERADOR" },
    ]

    for (const u of usuarios) {
        await prisma.funcionario.upsert({
            where: { usuario: u.usuario },
            update: {},
            create: u
        })
    }

    console.log("Seed concluído.")
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())