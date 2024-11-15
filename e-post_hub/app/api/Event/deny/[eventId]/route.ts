import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, { params }: { params: { eventId: string } }) {
  try {
    const { eventId } = params;

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: { status: 'DENIED' },
    });

    return NextResponse.json({ message: 'Event denied successfully', event: updatedEvent }, { status: 200 });
  } catch (error) {
    console.error('Error denying event:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
