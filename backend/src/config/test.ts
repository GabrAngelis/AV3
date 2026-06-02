import { prisma } from './prisma.ts';

async function main() {
  const aeronaves = await prisma.aeronave.findMany();

  console.log(aeronaves);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });