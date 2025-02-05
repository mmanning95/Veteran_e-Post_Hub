import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const origins = searchParams.get("origins");
    const destinations = searchParams.get("destinations");

    if (!origins || !destinations) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 500 });
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&units=imperial&key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json({ error: "Google API request failed" }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
