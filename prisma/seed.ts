import { PrismaClient, CategoryName } from "@prisma/client";
const prisma = new PrismaClient();
import { TicketCategories } from "@/constants";

async function main() {
  try {
    for (const category of TicketCategories) {
      const value = category.value as CategoryName;

      await prisma.category.upsert({
        where: { name: value },
        update: {},
        create: { name: value },
      });
    }

    console.log("Default categories created.");
  } catch (e) {
    console.error(e);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
