'use server';

import { prisma } from "@/lib/prisma";
import { adminRegisterSchema, AdminRegisterSchema } from "@/lib/schemas/adminRegisterSchema";
import bcrypt from 'bcryptjs'

export async function registerAdminUser(data: AdminRegisterSchema) {
    const validated = adminRegisterSchema.safeParse(data);

    if (!validated.success) {
        return {error: validated.error.errors}
    }

    const {name, email, password, officeNumber, officeHours, officeLocation, creatorCode} =validated.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
        where: {email}
    });

    if (existingUser) return {error: 'User already exist'};

    return prisma.user.create({
        data: {
            name,
            email,
            passwordHash: hashedPassword,
            role: 'ADMIN', // Set the role as ADMIN
            admin: {
                create: { // Create the related admin data
                    officeNumber,
                    officeHours,
                    officeLocation,
                    creatorCode
                }
            }
        }
    });
}