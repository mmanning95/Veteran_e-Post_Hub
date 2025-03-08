import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { questionId: string } }
) {
  const { questionId } = params;

  try {
    const comments = await prisma.comment.findMany({
      where: { questionId }, 
      include: {
        createdBy: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
