import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Parse the request body to get question details
    const { text, isPrivate } = await req.json();
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    // Extract token from Authorization header
    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'No token found' }, { status: 401 });
    }

    // Verify token and extract user information
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    } catch (err) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    if (!decodedToken) {
      return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 });
    }

    const { userId, email, name } = decodedToken as { userId: string; email: string; name: string };

    if (!email) {
      return NextResponse.json({ message: 'User email not found in token' }, { status: 400 });
    }

    // Create new question in the database
    const newQuestion = await prisma.question.create({
      data: {
        text,
        username: name,
        userEmail: email, // Ensure userEmail is correctly provided
        isPrivate,
        userId,
        datePosted: new Date(),
      },
    });

    return NextResponse.json({ message: 'Question posted successfully', question: newQuestion }, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
