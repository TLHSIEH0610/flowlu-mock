"use server";
// import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { logToSentry } from "@/utils/sentry";

export async function createTicket(
  prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const title = formData.get("title") as string;
    const type = formData.get("type") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;
    const estimation = formData.get("estimation") as string;

    if (!title || !description || !priority || !type || !estimation) {
      logToSentry(
        "Validation Error: Missing ticket fields",
        "ticket",
        { title, description, priority, type, estimation },
        "warning"
      );
      return { success: false, message: "All fields are required" };
    }

    // Create ticket
    const ticket = await prisma.ticket.create({
      data: { title, description, priority, type, estimation },
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
