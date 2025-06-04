"use server";
// import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { logToSentry } from "@/utils/sentry";
import { getCurrentUser } from "@/lib/auth";
import { Priority, TicketType } from "@prisma/client";

export async function createTicket(
  prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser();

    if (!user) {
      logToSentry(
        "Unauthorized ticket creation attempt",
        "ticket",
        {},
        "warning"
      );

      return {
        success: false,
        message: "You must be logged in to create a ticket",
      };
    }

    const title = formData.get("title") as string;
    const type = formData.get("type") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const estimation = parseInt(formData.get("estimation") as string) || 0;
    const categoryId = parseInt(formData.get("categoryId") as string) || 1;

    if (!title || !description) {
      console.log({ title, description, priority, type });
      logToSentry(
        "Validation Error: Missing ticket fields",
        "ticket",
        { title, description, priority, type },
        "warning"
      );
      return { success: false, message: "All fields are required" };
    }

    const enumPriority = priority as Priority;
    const enumType = type as TicketType;

    // Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority: enumPriority,
        type: enumType,
        estimation,
        user: {
          connect: { id: user.id },
        },
        category: {
          connect: { id: categoryId },
        },
      },
    });

    logToSentry(
      `Ticket created successfully: ${ticket.id}`,
      "ticket",
      { ticketId: ticket.id },
      "info"
    );

    revalidatePath("/tickets");

    return { success: true, message: "Ticket created successfully" };
  } catch (error) {
    logToSentry(
      "An error occured while creating the ticket",
      "ticket",
      {
        formData: Object.fromEntries(formData.entries()),
      },
      "error",
      error
    );

    return {
      success: false,
      message: "An error occured while creating the ticket",
    };
  }
}

export async function getTickets() {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
    });

    return tickets;
  } catch (error) {
    logToSentry("Error fetching tickets", "ticket", {}, "error", error);

    return [];
  }
}

export async function updateTicketCategory(
  ticketId: string,
  newCategoryId: number
): Promise<{ success: boolean; message: string }> {
  try {
    const category = await prisma.category.findUnique({
      where: { id: newCategoryId },
    });

    if (!category) {
      return {
        success: false,
        message: "Category not found",
      };
    }

    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        categoryId: newCategoryId,
      },
    });

    revalidatePath("/tickets");

    return {
      success: true,
      message: "Ticket moved to new category",
    };
  } catch (error) {
    logToSentry(
      "Error updating ticket category",
      "ticket",
      { ticketId, newCategoryId },
      "error",
      error
    );
    return {
      success: false,
      message: "An error occurred while moving the ticket",
    };
  }
}
