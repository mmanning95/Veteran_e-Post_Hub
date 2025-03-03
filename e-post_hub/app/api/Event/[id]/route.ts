import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import sgMail from '@sendgrid/mail';

//SG API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);


const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const existingEvent = await prisma.event.findUnique({
    where: { id },
    include: { createdBy: { select: { email: true, name: true } } },
  });
  
  try {
    // Parse request JSON
    const data = await req.json();
    
    let updatedLatitude = existingEvent?.latitude;
    let updatedLongitude = existingEvent?.longitude;

    // If the address has changed, fetch new latitude and longitude
    if (data.address && data.address !== existingEvent?.address) {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        if (apiKey) {
          const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(data.address)}&key=${apiKey}`;
          const response = await fetch(geoUrl);
          const geoData = await response.json();

          if (geoData.status === "OK" && geoData.results.length > 0) {
            updatedLatitude = geoData.results[0].geometry.location.lat;
            updatedLongitude = geoData.results[0].geometry.location.lng;
          } else {
            console.warn("Warning: Geolocation lookup failed. Proceeding without updating coordinates.");
          }
        } else {
          console.warn("Warning: Missing GOOGLE_MAPS_API_KEY. Skipping geolocation update.");
        }
      } catch (error) {
        console.error("Error fetching new geolocation:", error);
      }
    }


    // Added lat/long fields to be updated, for proximity filter which uses distance matrix API
    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        ...data,
        latitude: updatedLatitude,
        longitude: updatedLongitude,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });


    // Automatic email to be sent out when event changes.
    if (existingEvent?.createdBy?.email) {
      const msg = {
        to: existingEvent.createdBy.email,
        from: process.env.EMAIL_FROM || "default@example.com", //Set to admin email
        subject: 'Your Event Has Been Modified',
        text: `Hello ${existingEvent.createdBy.name},
    
    Your event "${updatedEvent.title}" has modified.
    
    Details:
    - Title: ${updatedEvent.title}
    - Date: ${updatedEvent.startDate ? updatedEvent.startDate.toISOString().split('T')[0] : "Not specified"} to ${updatedEvent.endDate ? updatedEvent.endDate.toISOString().split('T')[0] : "Not specified"}
    - Address: ${updatedEvent.address || "Not specified"}
    - Website: ${updatedEvent.website || "Not specified"}
    
    If you did not make these changes, please contact support.
    
    Best,
    The Veteran e-Post Hub Team`,
      };
    
      try {
        await sgMail.send(msg);
        console.log("Update email sent to:", existingEvent.createdBy.email);
      } catch (emailError) {
        console.error("Failed to send update email:", emailError);
      }
    }
    

    return NextResponse.json(updatedEvent, { status: 200 });
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ message: 'Failed to update event.' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
