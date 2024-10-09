// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        accounts: true, // Include related accounts if needed
        member: true, // Include related member if needed
        admin: true, // Include related admin if needed
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: Request) {
  const { name, email, passwordHash, officeNumber, officeHours, officeLocation } = await req.json(); // Parse the request body

  if (!name || !email || !passwordHash || !officeNumber || !officeHours || !officeLocation) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'ADMIN', // Set the role as ADMIN
        admin: {
          create: {
            officeNumber,
            officeHours,
            officeLocation,
          },
        },
      },
    });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
