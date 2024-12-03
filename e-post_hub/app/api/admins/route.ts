import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Handle GET requests to fetch the current creator code
export async function GET() {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key: 'creatorCode' },
    });

    // Return 404 if creator code not found
    if (!setting) {
      return NextResponse.json({ message: 'Creator code not found' }, { status: 404 });
    }

    // Return current creator code
    return NextResponse.json({ creatorCode: setting.value }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching creator code:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Handle POST request for updating creator code or admin registration.
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Handle creator code update
    if (body.newCreatorCode) {
      const { newCreatorCode } = body;

      //Validate creator code length.
      if (!newCreatorCode || newCreatorCode.trim().length < 6) {
        return NextResponse.json({ message: 'Invalid creator code' }, { status: 400 });
      }
      
      //Update  or create new creator code.
      const updated = await prisma.settings.upsert({
        where: { key: 'creatorCode' },
        update: { value: newCreatorCode },
        create: { key: 'creatorCode', value: newCreatorCode },
      });

      return NextResponse.json(
        { message: 'Creator code updated successfully', data: updated },
        { status: 200 }
      );
    }

    // Admin registration logic
    const { name, email, password, officeNumber, officeHours, officeLocation, creatorCode } = body;

    // Validate user input
    if (!name || name.trim().length < 3) {
      return NextResponse.json({ message: 'Invalid or missing name' }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ message: 'Invalid or missing email' }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ message: 'Invalid or missing password' }, { status: 400 });
    }
    if (officeNumber && isNaN(parseInt(officeNumber))) {
      return NextResponse.json({ message: 'Invalid office number' }, { status: 400 });
    }

    // Retrieve the current creator code from the database
    const currentCreatorCode = await prisma.settings.findUnique({
      where: { key: 'creatorCode' },
    });

   // Validation logic for creator code
    const defaultCreatorCode = "wc_create_admin"; // Default code
    if (
      currentCreatorCode?.value // If an updated creator code exists
        ? creatorCode !== currentCreatorCode.value // It must match the updated code
        : creatorCode !== defaultCreatorCode // Otherwise, it must match the default
    ) {
      return NextResponse.json({ message: 'Invalid creator code' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: 'ADMIN',
        admin: {
          create: {
            officeNumber: officeNumber?.toString(),
            officeHours,
            officeLocation,
            creatorCode,
          },
        },
      },
    });

    // Generate a JWT for the newly created admin user
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role,email: newUser.email, name: newUser.name },
      process.env.JWT_SECRET as string, // uses secret code in .env
    );

    return NextResponse.json(
      { user: newUser, token },
      { status: 201, headers: { 'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=7200` } }
    );
  } catch (error: any) {
    console.error('Error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}