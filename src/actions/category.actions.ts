"use server";

import { prisma } from "@/db/prisma";
import { logToSentry } from "@/utils/sentry";
import { CategoryProps } from "@/types/ticket";

export async function getCategories(): Promise<CategoryProps[]> {
  try {
    const categories = await prisma.category.findMany({
      include: { tickets: true },
    });

    return categories;
  } catch (error) {
    logToSentry("Error fetching categories", "category", {}, "error", error);
    return [];
  }
}
