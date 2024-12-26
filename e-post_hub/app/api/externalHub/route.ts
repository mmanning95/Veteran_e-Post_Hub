import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// POST: Add a new link
export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse JSON from the request body
    const { title, description, url, location, categoryId } = body;

    // Validate required fields
    if (!title || !url || !location) {
      return NextResponse.json(
        { message: "Title, URL, and Location are required." },
        { status: 400 }
      );
    }

    // Create a new link
    const newLink = await prisma.link.create({
      data: {
        title,
        description: description || "", // Default to an empty string if description is not provided
        url,
        location,
        categoryId: categoryId || null, // Allow null for uncategorized links
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

// GET: Fetch links with optional filters
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const location = url.searchParams.get("location");
    const category = url.searchParams.get("category");

    // Fetch links with optional filters
    const links = await prisma.link.findMany({
      where: {
        ...(location && location !== "All" ? { location } : {}),
        ...(category && category !== "All"
          ? { category: { name: category } }
          : {}),
      },
      include: {
        category: true, // Include category details in the response
      },
    });

    // Transform the result
    const transformedLinks = links.map((link) => ({
      id: link.id,
      title: link.title,
      description: link.description,
      url: link.url,
      location: link.location,
      category: { name: link.category?.name || "Uncategorized" },
    }));

    return NextResponse.json(transformedLinks, { status: 200 });
  } catch (error) {
    console.error("Error fetching links:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

