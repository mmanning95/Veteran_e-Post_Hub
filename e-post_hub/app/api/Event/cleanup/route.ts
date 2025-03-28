import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { subMonths } from "date-fns";

const prisma = new PrismaClient();

export async function DELETE() {
  const oneMonthAgo = subMonths(new Date(), 1);

  try {
    const expiredEvents = await prisma.event.findMany({
      where: {
        endDate: {
          lt: oneMonthAgo.toISOString(),
        },
      },
    });

    for (const event of expiredEvents) {
      if (event.flyer) {
        try {
          const res = await fetch("https://api.edgestore.dev/api/file", {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "x-edgestore-access-key": process.env.EDGE_STORE_ACCESS_KEY!,
              "x-edgestore-secret-key": process.env.EDGE_STORE_SECRET_KEY!,
            },
            body: JSON.stringify({ url: event.flyer }),
          });

          if (!res.ok) {
            const errText = await res.text();
            console.error("EdgeStore DELETE failed:", errText);
          } else {
            console.log("Deleted flyer from EdgeStore:", event.flyer);
          }
        } catch (err) {
          console.error("Failed to delete flyer from EdgeStore:", event.flyer, err);
        }
      }

      await prisma.comment.deleteMany({
        where: { eventId: event.id },
      });

      await prisma.event.delete({
        where: { id: event.id },
      });
    }

    return NextResponse.json({
      message: `Deleted ${expiredEvents.length} expired event(s) and their files.`,
    });
  } catch (error) {
    console.error("Error during cleanup:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
