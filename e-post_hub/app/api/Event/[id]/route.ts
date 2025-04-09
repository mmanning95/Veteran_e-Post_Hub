import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import sgMail from "@sendgrid/mail";

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
        occurrences: true, 
      },
    });

    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ event }, { status: 200 });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  // We find the existing event so we can see if the address changed,
  const existingEvent = await prisma.event.findUnique({
    where: { id },
    include: {
      createdBy: { select: { email: true, name: true } },
      occurrences: true,
    },
  });

  if (!existingEvent) {
    return NextResponse.json({ message: "Event not found" }, { status: 404 });
  }

  try {
    // Parse JSON body
    const data = await req.json();

    let updatedLatitude = existingEvent.latitude;
    let updatedLongitude = existingEvent.longitude;

    if (data.address && data.address !== existingEvent.address) {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (apiKey) {
          const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            data.address
          )}&key=${apiKey}`;
          const response = await fetch(geoUrl);
          const geoData = await response.json();

          if (geoData.status === "OK" && geoData.results.length > 0) {
            updatedLatitude = geoData.results[0].geometry.location.lat;
            updatedLongitude = geoData.results[0].geometry.location.lng;
          } else {
            console.warn(
              "Warning: Geolocation lookup failed. Proceeding without updating coordinates."
            );
          }
        } else {
          console.warn(
            "Warning: Missing GOOGLE_MAPS_API_KEY. Skipping geolocation update."
          );
        }
      } catch (error) {
        console.error("Error fetching new geolocation:", error);
      }
    }

    // Extract eventOccurrences from the request body if provided
    const { eventOccurrences, ...rest } = data;

    const updateData: any = {
      ...rest,
      latitude: updatedLatitude,
      longitude: updatedLongitude,
      startDate: rest.startDate ? new Date(rest.startDate) : null,
      endDate: rest.endDate ? new Date(rest.endDate) : null,
    };

    if (eventOccurrences) {
      // We'll do this in a transaction
      await prisma.$transaction([
        // 1) Remove existing occurrences for this event
        prisma.eventOccurrence.deleteMany({
          where: { eventId: id },
        }),
        // 2) Update the event
        prisma.event.update({
          where: { id },
          data: updateData,
        }),
        // 3) Create the new occurrences
        prisma.eventOccurrence.createMany({
          data: eventOccurrences.map((occ: any) => ({
            eventId: id,
            // Convert occ.date to a date, if it's "2025-08-10"
            // or do new Date(...) if it's "2025-08-10T00:00:00Z"
            date: new Date(occ.date),
            startTime: occ.startTime || null,
            endTime: occ.endTime || null,
          })),
        }),
      ]);

      const finalEvent = await prisma.event.findUnique({
        where: { id },
        include: { createdBy: true, occurrences: true },
      });

      // Email the user about the update
      await sendUpdateEmail(existingEvent, finalEvent);

      return NextResponse.json(finalEvent, { status: 200 });
    } else {
      // If no eventOccurrences in request, we just update the event normally
      const updatedEvent = await prisma.event.update({
        where: { id },
        data: updateData,
        include: { createdBy: true, occurrences: true },
      });

      // Email user
      await sendUpdateEmail(existingEvent, updatedEvent);

      return NextResponse.json(updatedEvent, { status: 200 });
    }
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { message: "Failed to update event." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to send the email after update
async function sendUpdateEmail(existingEvent: any, updatedEvent: any) {
  if (existingEvent?.createdBy?.email) {
    const msg = {
      to: existingEvent.createdBy.email,
      from: process.env.EMAIL_FROM || "default@example.com", //Set to admin email
      subject: "Your Event Has Been Modified",
      text: `Hello ${existingEvent.createdBy.name},

Your event "${updatedEvent.title}" has been modified.

Details:
- Title: ${updatedEvent.title}
- Date: ${
        updatedEvent.startDate
          ? updatedEvent.startDate.toISOString().split("T")[0]
          : "Not specified"
      } to ${
        updatedEvent.endDate
          ? updatedEvent.endDate.toISOString().split("T")[0]
          : "Not specified"
      }
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
}
