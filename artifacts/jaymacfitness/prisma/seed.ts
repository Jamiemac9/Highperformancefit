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
    {
      name: "Starter",
      type: "IN_PERSON" as const,
      sessions: 5,
      price: 250.0,
      pricePerSession: 50.0,
      description: "Try personal training. See what's possible.",
      highlights: [
        "Full movement & posture assessment",
        "Personalised training plan",
        "WhatsApp support between sessions",
        "Use within 8 weeks",
      ],
      isActive: true,
      featured: false,
    },
    {
      name: "Commitment",
      type: "IN_PERSON" as const,
      sessions: 10,
      price: 450.0,
      pricePerSession: 45.0,
      description: "Build the habit. See real change.",
      highlights: [
        "Everything in Starter",
        "Bespoke nutrition guidance",
        "Monthly progress check-ins",
        "Use within 12 weeks",
      ],
      isActive: true,
      featured: false,
    },
    {
      name: "Group",
      type: "GROUP" as const,
      sessions: 8,
      price: 200.0,
      pricePerSession: 25.0,
      description: "Train hard, train together. Small groups, big results.",
      highlights: [
        "Max 4 people per session",
        "Tailored to mixed abilities",
        "Weekly programmed sessions",
        "Community accountability",
      ],
      isActive: true,
      featured: false,
    },
    {
      name: "Transformation",
      type: "IN_PERSON" as const,
      sessions: 24,
      price: 960.0,
      pricePerSession: 40.0,
      description: "12 weeks. 2 sessions a week. Total transformation.",
      highlights: [
        "Everything in Commitment",
        "Full bespoke meal plan",
        "Weekly body composition tracking",
        "Direct WhatsApp access 7 days",
        "Photo & measurement reviews",
      ],
      isActive: true,
      featured: true,
    },
  ];

  for (const p of packages) {
    await prisma.package.upsert({
      where: { name: p.name },
      update: p,
      create: p,
    });
  }

  // Deactivate any old/legacy packages no longer in the seed list so the
  // public landing page only shows the canonical four.
  const keepNames = packages.map((p) => p.name);
  await prisma.package.updateMany({
    where: { name: { notIn: keepNames } },
    data: { isActive: false },
  });

  console.log("Seed complete.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
