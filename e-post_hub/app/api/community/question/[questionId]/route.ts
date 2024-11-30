// e-post_hub\app\api\community\question\[questionId]\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: NextRequest, { params }: { params: { questionId: string } }) {
  const { questionId } = params;

  try {
    // Delete the question by ID
    await prisma.question.delete({
      where: {
        id: questionId,
      },
    });

    return NextResponse.json({ message: 'Question resolved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error resolving question:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
