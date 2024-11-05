import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: Request) {  
  try {
    const { name, email, password } = await req.json();

    // Input validation
    if (!name || name.trim().length < 3) {
      console.error('Invalid or missing name');
      return NextResponse.json({ message: 'Invalid or missing name' }, { status: 400 });
    }

    if (!email || !email.includes('@')) {
      console.error('Invalid or missing email');
      return NextResponse.json({ message: 'Invalid or missing email' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      console.error('Invalid or missing password');
      return NextResponse.json({ message: 'Invalid or missing password' }, { status: 400 });
    }
    // Input validation
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new member user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: 'MEMBER',
        member: {
          create: {}, // Add member-specific data if needed
        },
      },
    });

    // Generate JWT for the new member
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role, name: newUser.name },
      process.env.JWT_SECRET as string,
      { expiresIn: '4h' }
    );

    // Return the new user and the token
    return NextResponse.json(
      { user: newUser, token },
      { status: 201, headers: { 'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=14400` } }
    );
  } catch (error: any) {
    console.error('Error registering member:', error.message);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}