import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user ){//|| user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET!, // Ensure you set JWT_SECRET in your .env file
      { expiresIn: '1h' }
    );

    return NextResponse.json({ message: 'Login successful', token }, { status: 200 });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
