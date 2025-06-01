"use server";
// import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { logToSentry } from "@/utils/sentry";
import { getCurrentUser } from "@/lib/auth";

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
    const category = parseInt(formData.get("category") as string) || 1;

    if (!title || !description || !priority || !type) {
      console.log({ title, description, priority, type });
      logToSentry(
        "Validation Error: Missing ticket fields",
        "ticket",
        { title, description, priority, type },
        "warning"
      );
      return { success: false, message: "All fields are required" };
    }

    // Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority,
        type,
        estimation,
        status: "OPEN",
        user: {
          connect: { id: user.id },
        },
        category: {
          connect: { id: category },
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
