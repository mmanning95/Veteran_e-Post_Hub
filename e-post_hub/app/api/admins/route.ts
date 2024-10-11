// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient();

// export async function GET() {
//   try {
//     const users = await prisma.user.findMany({
//       include: {
//         accounts: true, // Include related accounts if needed
//         member: true, // Include related member if needed
//         admin: true, // Include related admin if needed
//       },
//     });
//     return NextResponse.json(users);
//   } catch (error) {
//     console.error(error); // Log the error for debugging
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// export async function POST(req: Request) {
//   const { name, email, passwordHash, officeNumber, officeHours, officeLocation } = await req.json(); // Parse the request body

//   if (!name || !email || !passwordHash || !officeNumber || !officeHours || !officeLocation) {
//     return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
//   }

//   try {
//     const newUser = await prisma.user.create({
//       data: {
//         name,
//         email,
//         passwordHash,
//         role: 'ADMIN', // Set the role as ADMIN
//         admin: {
//           create: {
//             officeNumber,
//             officeHours,
//             officeLocation,
//           },
//         },
//       },
//     });
//     return NextResponse.json(newUser, { status: 201 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

export async function POST(req: Request) {
  try {
    const { name, email, password, officeNumber, officeHours, officeLocation, creatorCode } = await req.json();

    //Error checking
    if (!name || name.trim().length < 3) {
      console.error('Invalid or missing name');
      return NextResponse.json({ message: 'Invalid or missing name' }, { status: 400 });
    }

    if (!email || !email.includes('@')) {
      console.error('Invalid or missing email');
      return NextResponse.json({ message: 'Invalid or missing email' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      console.error('Invalid or missing password');
      return NextResponse.json({ message: 'Invalid or missing password' }, { status: 400 });
    }

    if (!creatorCode || creatorCode !== 'wc_create_admin') {
      console.error('Invalid creator code');
      return NextResponse.json({ message: 'Invalid creator code' }, { status: 400 });
    }

    if (officeNumber && isNaN(parseInt(officeNumber))) {
      console.error('Invalid office number (should be numeric)');
      return NextResponse.json({ message: 'Invalid office number' }, { status: 400 });
    }
    // Input validation
    if (!name || !email || !password || !creatorCode) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
        role: 'ADMIN',
        admin: {
          create: {
            officeNumber: officeNumber.toString(),
            officeHours,
            officeLocation,
            creatorCode,
          },
        },
      },
    });

    console.log('Admin successfully created:', newUser)
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error('Error registering admin:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.meta) {
      console.error('Error metadata:', error.meta);
    }
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}