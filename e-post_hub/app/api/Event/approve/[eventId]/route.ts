import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import sgMail from '@sendgrid/mail'; // ✅ ADD THIS LINE

const prisma = new PrismaClient();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export async function PATCH(req: NextRequest, { params }: { params: { eventId: string } }) {
  try {
    const { eventId } = params;

    if (!eventId) {
      console.error("Missing event ID");
      return NextResponse.json({ message: 'Event ID is required' }, { status: 400 });
    }

    console.log("Attempting to approve event with ID:", eventId); // Log the event ID

    // Check if the event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { createdBy: { select: { email: true, name: true } } }, // ✅ ADDED TO FETCH EMAIL
    });
    if (!event) {
      console.error("Event not found");
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    // Update the event status to APPROVED
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: { status: 'APPROVED' },
    });

    console.log("Event approved successfully:", updatedEvent); // Log the updated event

    if (event.createdBy?.email) {
      const msg = {
        to: event.createdBy.email,
        from: process.env.EMAIL_FROM || "default@example.com", // ✅ Fallback email
        subject: 'Your Event Has Been Approved!',
        text: `Hello ${event.createdBy.name},\n\nYour event "${event.title}" has been approved!\n\nThank you for submitting your event.\n\nBest,\nThe Veteran e-Post Hub Team`,
      };

      try {
        await sgMail.send(msg);
        console.log("Approval email sent to:", event.createdBy.email);
      } catch (emailError) {
        console.error("Failed to send approval email:", emailError);
      }
    }

    return NextResponse.json({ message: 'Event approved successfully', event: updatedEvent }, { status: 200 });
  } catch (error) {
    console.error('Error approving event:', error);
    return NextResponse.json({ message: 'Internal Server Error', details: error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}


