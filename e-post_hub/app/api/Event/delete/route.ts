import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import sgMail from "@sendgrid/mail";
import { deleteEventSchema } from "@/lib/schemas/deleteEventSchema";

const prisma = new PrismaClient();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function DELETE(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body using deleteEventSchema
    const validation = deleteEventSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }
    
    const { eventId } = validation.data;

    // Fetch event details before deletion
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { createdBy: { select: { email: true, name: true } } }, // Fetch creator details
    });

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Delete the event
    await prisma.event.delete({
      where: { id: eventId },
    });

    // Send email notification to event creator
    if (event.createdBy?.email) {
      const msg = {
        to: event.createdBy.email,
        from: process.env.EMAIL_FROM || "default@example.com", // Admin email
        subject: "Your Event Has Been Deleted",
        text: `Hello ${event.createdBy.name},\n\nWe regret to inform you that your event "${event.title}" has been deleted from the Veteran e-Post Hub.\n\nIf you believe this was a mistake, please contact the administrator.\n\nBest,\nThe Veteran e-Post Hub Team`,
      };

      try {
        await sgMail.send(msg);
        console.log("Deletion email sent to:", event.createdBy.email);
      } catch (emailError) {
        console.error("Failed to send deletion email:", emailError);
      }
    }

    return NextResponse.json(
      { message: "Event deleted successfully." },
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
