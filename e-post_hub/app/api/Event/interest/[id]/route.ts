import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // Event ID
    
    // Increment the interested count for the event
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { interested: { increment: 1 } },
    });

    return NextResponse.json({ message: 'Interest recorded successfully.', event: updatedEvent }, { status: 200 });
  } catch (error) {
    console.error('Error updating interest:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
