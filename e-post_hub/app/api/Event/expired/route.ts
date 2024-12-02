import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const currentDate = new Date();
    // Fetch expired events
    const events = await prisma.event.findMany({
      where: {
        endDate: {
          lt: currentDate, // Events with an end date earlier than now
        },
      },
      include: { createdBy: true },
    });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error('Error fetching expired events:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}