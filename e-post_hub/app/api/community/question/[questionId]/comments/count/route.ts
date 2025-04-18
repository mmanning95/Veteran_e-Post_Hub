import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { questionId: string } }
) {
  const { questionId } = params;

  try {
    const count = await prisma.comment.count({
      where: { questionId },
    });

    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
