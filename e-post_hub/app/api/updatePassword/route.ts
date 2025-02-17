import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { oldPassword, newPassword } = await req.json();

    // 1. Validate input
    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Old password and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: 'New password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // 2. Grab the token (from client’s request headers, cookies, or however you’re storing it).
    //    Here, we assume the token is in the Authorization header: "Bearer <token>"
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { message: 'No authorization header found' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '').trim();

    // 3. Decode and verify JWT
    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // 4. Find the user in DB
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
    });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // 5. Check old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Old password is incorrect' },
        { status: 400 }
      );
    }

    // 6. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 7. Update user’s password
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashedPassword },
    });

    return NextResponse.json({ message: 'Password updated successfully' });
  } catch (error: any) {
    console.error('Error updating password:', error.message);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
