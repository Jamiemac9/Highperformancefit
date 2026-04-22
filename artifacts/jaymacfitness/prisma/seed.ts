import pkg from "@prisma/client";
import bcrypt from "bcryptjs";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  const trainerEmail = "trainer@example.com";
  const passwordHash = await bcrypt.hash("Admin1234!", 10);

  await prisma.user.upsert({
    where: { email: trainerEmail },
    update: { passwordHash, role: "TRAINER" },
    create: { email: trainerEmail, passwordHash, role: "TRAINER" },
  });

  const packages = [
    { name: "Starter Pack", sessions: 5, price: 175.0, description: "5 personal training sessions to kickstart your journey." },
    { name: "Commitment Pack", sessions: 10, price: 300.0, description: "10 sessions to build lasting momentum and results." },
  ];

  for (const p of packages) {
    const existing = await prisma.package.findFirst({ where: { name: p.name } });
    if (existing) {
      await prisma.package.update({ where: { id: existing.id }, data: p });
    } else {
      await prisma.package.create({ data: p });
    }
  }

  console.log("Seed complete.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
