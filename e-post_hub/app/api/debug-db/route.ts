import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const allEvents = await prisma.event.findMany({
      take: 10,
    });

    const summary = allEvents.map((e) => ({
      id: e.id,
      title: e.title,
      status: e.status,
    }));

    console.log("Queried Events:", summary);

    return NextResponse.json({ events: summary });
  } catch (error) {
    console.error("DB Query Error:", error);
    return NextResponse.json({ error: "DB query failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
