// This route is used when creating a new admin user

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();

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
    
//     //error checking to browser console
//     console.log('Admin successfully created:', newUser)
//     return NextResponse.json(newUser, { status: 201 });
//   } catch (error: any) {
//     console.error('Error registering admin:', error.message);
//     if (error.code) {
//       console.error('Error code:', error.code);
//     }
//     if (error.meta) {
//       console.error('Error metadata:', error.meta);
//     }
//     return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

    // Create a JWT for the newly created admin user
    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role, name: newUser.name },
      process.env.JWT_SECRET as string, // uses secret code in .env
      { expiresIn: '4h' }
    );

    // Return the new user and the token
    return NextResponse.json(
      { user: newUser, token },
      { status: 201, headers: { 'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=7200` } }
    );
  } catch (error: any) {
    console.error('Error registering admin:', error.message);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}