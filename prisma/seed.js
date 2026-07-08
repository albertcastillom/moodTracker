require("dotenv").config();

const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@moodtracker.local" },
    update: {},
    create: {
      email: "demo@moodtracker.local",
      displayName: "Demo",
      passwordHash,
      habits: {
        create: [
          { name: "Morning walk" },
          { name: "Drink water" },
          { name: "Ten mindful breaths" },
        ],
      },
    },
  });

  await prisma.moodEntry.upsert({
    where: {
      userId_entryDate: {
        userId: user.id,
        entryDate: new Date(new Date().toISOString().slice(0, 10)),
      },
    },
    update: {},
    create: {
      userId: user.id,
      rating: 7,
      note: "A steady demo day.",
      city: "Los Angeles",
      region: "California",
      country: "United States",
      entryDate: new Date(new Date().toISOString().slice(0, 10)),
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
