import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { content, questionId, userId, parentId } = await req.json();

  if (!content || !questionId || !userId) {
    return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        questionId,  
        userId,
        parentId,
      } as Prisma.CommentUncheckedCreateInput,
      include: {
        createdBy: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
