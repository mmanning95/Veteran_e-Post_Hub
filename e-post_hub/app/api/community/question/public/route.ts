import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Query the database to get all non-private questions
    const questions = await prisma.question.findMany({
      where: {
        isPrivate: false,
      },
      select: {
        id: true,
        text: true,
        username: true,
        datePosted: true,
      },
      orderBy: {
        datePosted: 'desc',
      },
    });

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching public questions:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
