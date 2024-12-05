// This route is used when creating a new event

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');

    console.log('Authorization Header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {

      console.log('Authorization Error: Missing or invalid header');

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

    const { role, userId } = decodedToken as { role: string; userId: string };
    if (role !== 'ADMIN' && role !== 'MEMBER') {
      return NextResponse.json({ message: 'Unauthorized: Insufficient privileges' }, { status: 403 });
    }

    const { website, title, startDate, endDate, description, startTime, endTime, flyer } = await req.json();

    // Validate title or flyer requirement
    if (!title && !flyer) {
      return NextResponse.json({ message: 'Either title or flyer is required' }, { status: 400 });
    }

    // Set status based on role
    const eventStatus = role === 'ADMIN' ? 'APPROVED' : 'PENDING';

    // Create the event
    const newEvent = await prisma.event.create({
      data: {
        createdById: userId,
        website,
        title,
        startDate: startDate ? new Date(startDate + 'T00:00:00') : null,
        endDate: endDate ? new Date(endDate + 'T23:59:59') : null,
        description,
        startTime,
        endTime,
        flyer,
        status: eventStatus, // Automatically set status based on role
      },
    });

    return NextResponse.json({ message: 'Event created successfully', event: newEvent }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
