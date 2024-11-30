import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const privateQuestions = await prisma.question.findMany({
      where: {
        isPrivate: true,
      },
      select: {
        id: true,
        text: true,
        username: true,
        userEmail: true,
        datePosted: true,
      },
    });

    return NextResponse.json({ questions: privateQuestions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching private questions:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
