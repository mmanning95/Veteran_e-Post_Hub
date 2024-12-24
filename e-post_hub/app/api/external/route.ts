import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const location = url.searchParams.get("location"); // Get location filter
    const category = url.searchParams.get("category"); // Get category filter

    // Query the database with optional location and category filters
    const links = await prisma.link.findMany({
      where: {
        ...(location && location !== "All" ? { location } : {}),
        ...(category && category !== "All"
          ? { category: { name: category } }
          : {}),
      },
      include: {
        category: true, // Include category details
      },
    });

    // Transform the result to include only the required fields
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