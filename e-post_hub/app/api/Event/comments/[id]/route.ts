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


export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id: commentId } = params; // Extract the comment ID from the route parameter
  const { content } = await req.json(); // Extract the new comment content from the request body

  // Check if content is empty
  if (!content || content.trim() === "") {
    return NextResponse.json({ message: "Content cannot be empty" }, { status: 400 });
  }

  // Extract the token from the Authorization header
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Decode the JWT token to get user details
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const userId = decodedToken?.userId; // Extract the user's ID from the token
  const userRole = decodedToken?.role; // Extract the user's role (e.g., ADMIN or MEMBER)

  // If the user ID is missing, they are unauthorized
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find the comment in the database to ensure it exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }

    // Check if the user is authorized to edit the comment
    if (userRole !== "ADMIN" && comment.userId !== userId) {
      // Admins can edit all comments; members can edit only their own
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Update the comment in the database
    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: { content }, // Update the content field
    });

    // Return the updated comment
    return NextResponse.json(updatedComment, { status: 200 });
  } catch (error) {
    console.error("Error updating comment:", error); // Log any errors for debugging
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  } finally {
    await prisma.$disconnect(); // Disconnect from the database to avoid connection leaks
  }
}
