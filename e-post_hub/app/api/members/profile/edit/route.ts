//Route used for editing profile

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized: Invalid token format' }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (error) {
      return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const { userId } = decodedToken as { userId: string };

    const { name, email } = await req.json();

    try {
      // Update user profile
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          email,
        },
      });

      return NextResponse.json({ message: 'Profile updated successfully', user: updatedUser }, { status: 200 });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unique constraint failed')) {
        return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error updating profile:', error);

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  } finally {
    await prisma.$disconnect();
  }
}
