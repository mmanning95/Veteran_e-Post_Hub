import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: { eventId: string } }) {
  try {
    const { eventId } = params;

    if (!eventId) {
      console.error("Missing event ID");
      return NextResponse.json({ message: 'Event ID is required' }, { status: 400 });
    }

    console.log("Attempting to approve event with ID:", eventId); // Log the event ID

    // Check if the event exists
    const event = await prisma.event.findUnique({ where: { id: eventId } });
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

    return NextResponse.json({ message: 'Event approved successfully', event: updatedEvent }, { status: 200 });
  } catch (error) {
    console.error('Error approving event:', error);
    return NextResponse.json({ message: 'Internal Server Error', details: error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}


