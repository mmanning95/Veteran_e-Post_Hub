import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// DELETE handler for deleting expired events
export async function DELETE(request: Request) {
  try {
    const { eventIds } = await request.json(); // Get event IDs from the request body

    if (!eventIds || !Array.isArray(eventIds)) {
      return NextResponse.json(
        { error: "Invalid request. Provide an array of event IDs." },
        { status: 400 }
      );
    }

    // Delete events based on the provided IDs
    const deletedEvents = await prisma.event.deleteMany({
      where: {
        id: {
          in: eventIds, // Matches any of the provided event IDs
        },
      },
    });

    return NextResponse.json(
      { message: "Events deleted successfully.", deletedCount: deletedEvents.count },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting events:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}