// This route is used when creating a new event

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    let role = "GUEST";
    let userId: string | null = null;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
          role: string;
          userId: string;
        };
        role = decodedToken.role;
        userId = decodedToken.userId;
      } catch (error) {
        console.warn("Invalid token, treating as guest:", error);     
      }
    }   

    const { website, title, startDate, endDate, description, startTime, endTime, flyer, type, address, latitude, longitude } = await req.json();

    // Fetch latitude and longitude from Google Maps API if an address is provided
    let resolvedLatitude = latitude;
    let resolvedLongitude = longitude;

    if (address && (!latitude || !longitude)) {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        // Check if API key is missing
        if (!apiKey) {
          console.warn("Warning: GOOGLE_MAPS_API_KEY is missing. Proceeding without geolocation.");
        } else {
          const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
          const response = await fetch(geoUrl);
          const geoData = await response.json();

          if (geoData.status === "OK" && geoData.results.length > 0) {
            resolvedLatitude = geoData.results[0].geometry.location.lat;
            resolvedLongitude = geoData.results[0].geometry.location.lng;
          } else {
            console.warn("Warning: Geolocation lookup failed. Proceeding without coordinates.");
          }
        }
      } catch (error) {
        // Log error but continue
        console.error("Error fetching geolocation:", error);
        console.warn("Proceeding without coordinates due to geolocation failure.");
      }
    }

    // Validate title or flyer requirement
    if (!title && !flyer) {
      return NextResponse.json({ message: 'Either title or flyer is required' }, { status: 400 });
    }

    // Set status based on role
    const eventStatus = role === 'ADMIN' ? 'APPROVED' : 'PENDING';

    // Create the event
    const newEvent = await prisma.event.create({
      data: {
        createdById: userId || undefined,
        website,
        title,
        startDate: startDate ? new Date(startDate + 'T00:00:00') : null,
        endDate: endDate ? new Date(endDate + 'T23:59:59') : null,
        description,
        startTime,
        endTime,
        flyer,
        type,
        address,
        latitude: resolvedLatitude,
        longitude: resolvedLongitude,
        status: eventStatus, // Automatically set status based on role
      },
    });

    return NextResponse.json({ message: 'Event created successfully', event: newEvent }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
