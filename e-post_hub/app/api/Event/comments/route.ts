import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const { content, eventId, userId } = await req.json();
  
    console.log("Received Data:", { content, eventId, userId });
  
    if (!content || !eventId || !userId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }
  
    try {
      const newComment = await prisma.comment.create({
        data: {
          content, // Ensure this matches the name in your frontend
          eventId,
          userId,
        },
        include: {
          createdBy: { // Include the user's name and email in the response
            select: {
              name: true,
              email: true,
            },
          },
        },
      });
  
      return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
      console.error("Error adding comment:", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    } finally {
      await prisma.$disconnect();
    }
  }
  