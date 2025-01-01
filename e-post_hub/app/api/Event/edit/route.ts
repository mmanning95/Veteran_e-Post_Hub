import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handle GET request
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id'); // Extract the event ID from query params

  if (!id) {
    return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      console.log("Event not found for ID:", id); // Debug log
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event, { status: 200 });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch the event' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Handle PUT request for updating an event
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      id,
      title,
      description,
      startDate,
      endDate,
      startTime,
      endTime,
      flyer,
      website,
    } = body;

    // Validate required fields
    if (!id || !title) {
      return NextResponse.json(
        { error: 'ID and title are required' },
        { status: 400 }
      );
    }

    // Update the event in the database
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        startTime,
        endTime,
        flyer,
        website,
      },
    });

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update the event' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

