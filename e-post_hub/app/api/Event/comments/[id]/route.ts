import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } } // Match the `[id]` folder parameter name
) {
  const { id: eventId } = params; // Extract `id` as `eventId`

  if (!eventId) {
    console.error("Event ID is undefined");
    return NextResponse.json(
      { message: "Event ID is required" },
      { status: 400 }
    );
  }

  console.log("Fetching comments for Event ID:", eventId); // Log to verify eventId

  try {
    const comments = await prisma.comment.findMany({
      where: { eventId },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        replies: { // Include replies in the query
          include: {
            createdBy: {
              select: {
                id:true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: commentId } = params;
  const token = req.headers.get("authorization")?.split(" ")[1]; // Extract Bearer token
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const userId = decodedToken?.userId;
  const userRole = decodedToken?.role;

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find the comment to ensure it exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }

    // Check if the user is authorized to delete the comment
    if (userRole !== "ADMIN" && comment.userId !== userId) {
      // Members can only delete their own comments
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Delete the comment
    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ message: "Comment deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
