"use server";

import { prisma } from "@/db/prisma";
import { logToSentry } from "@/utils/sentry";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({});

    return categories;
  } catch (error) {
    logToSentry("Error fetching categories", "category", {}, "error", error);
    return [];
  }
}
