import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  try {
    // Extract the token from the request headers
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Decode and verify the JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: string };

    // Ensure the user is a member
    if (!decodedToken || decodedToken.role !== 'MEMBER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Delete the member user by their user ID
    const userId = decodedToken.userId;
    await prisma.member.delete({
      where: {
        userId: userId,
      },
    });

    // Delete the user record associated with the member
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return NextResponse.json({ message: 'Account deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting member account:', error);
    return NextResponse.json({ message: 'Internal Server Error', details: error }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
