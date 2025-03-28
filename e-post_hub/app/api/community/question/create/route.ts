import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Parse the request body to get question details
    const { text, isPrivate, username, contactEmail } = await req.json();
    const authHeader = req.headers.get('authorization');

    let userId = null;
    let email = contactEmail;
    let name = username;

    // If there's an Authorization header, verify the user is logged in
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        try {
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
          const { userId: decodedUserId, email: decodedEmail, name: decodedName } = decodedToken as {
            userId: string;
            email: string;
            name: string;
          };
          userId = decodedUserId;
          email = decodedEmail;
          name = decodedName;
        } catch (err) {
          return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }
      }
    }

    // Ensure that either email or contactEmail is present
    if (!email) {
      return NextResponse.json({ message: 'Email is required for posting a question' }, { status: 400 });
    }

    // Create new question in the database
    const newQuestion = await prisma.question.create({
      data: {
        text,
        username: name || 'Anonymous', // Default to 'Anonymous' if name is not provided
        userEmail: email,
        isPrivate,
        userId, // userId will be null if the user is not logged in
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
