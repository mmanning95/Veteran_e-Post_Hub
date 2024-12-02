import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { deleteEventSchema } from "@/lib/schemas/deleteEventSchema";

const prisma = new PrismaClient();

export async function DELETE(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();

    // Validate the request body using deleteEventSchema
    const validation = deleteEventSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    // Extract the eventId from the validated data
    const { eventId } = validation.data;

    // Delete the event with the matching ID
    const deletedEvent = await prisma.event.delete({
      where: { id: eventId },
    });

    return NextResponse.json(
      {
        message: "Event deleted successfully.",
        deletedEvent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
