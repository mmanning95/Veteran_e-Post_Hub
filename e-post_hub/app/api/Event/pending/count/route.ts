import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pendingCount = await prisma.event.count({
      where: {
        status: 'PENDING',
      },
    });

    const privateQuestionsCount = await prisma.question.count({
      where: {
        isPrivate: true,
      },
    });

    return NextResponse.json({ count: pendingCount + privateQuestionsCount }, { status: 200 });
  } catch (error) {
    console.error('Error fetching pending events count:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
