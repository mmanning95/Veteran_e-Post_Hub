import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse JSON from the request body
    const { title, description, url, location, categoryId } = body;

    // Validate required fields
    if (!title || !url || !location || !categoryId) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Create a new link
    const newLink = await prisma.link.create({
      data: {
        title,
        description,
        url,
        location,
        categoryId,
      },
    });

    return NextResponse.json(newLink, { status: 201 });
  } catch (error) {
    console.error("Error creating link:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
