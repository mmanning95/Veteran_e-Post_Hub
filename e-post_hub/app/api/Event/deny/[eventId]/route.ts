import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import sgMail from '@sendgrid/mail';

const prisma = new PrismaClient();
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string); // Sendgrid API Key

export async function PATCH(req: NextRequest, { params }: { params: { eventId: string } }) {
  try {
    const { eventId } = params;
    const { denyMessage } = await req.json();

    // Check to ensure denial message is present.
    if (!denyMessage || denyMessage.trim().length === 0) {
      console.error("Rejection message is missing or empty");
      return NextResponse.json({ message: 'Rejection message is required' }, { status: 400 });
    }

    // Fetch event and creator email
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { createdBy: { select: { email: true, name: true } } },
    });

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: { status: 'DENIED' },
    });

     // Send rejection email
     if (event.createdBy?.email) {
      const msg = {
        to: event.createdBy.email,
        from: process.env.EMAIL_FROM || "default@example.com",
        subject: 'Your Event Has Been Rejected',
        text: `Hello ${event.createdBy.name},\n\nYour event "${event.title}" has been rejected.\n\nReason: ${denyMessage}\n\nBest,\nVeteran e-Post Hub Team`,
      };

      try {
        await sgMail.send(msg);
        console.log("Rejection email sent to:", event.createdBy.email);
      } catch (emailError) {
        console.error("Failed to send rejection email:", emailError);
      }
    }

    return NextResponse.json({ message: 'Event denied successfully', event: updatedEvent }, { status: 200 });
  } catch (error) {
    console.error('Error denying event:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
