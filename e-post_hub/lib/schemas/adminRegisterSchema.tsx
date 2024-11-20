// Schema used to accept inputs for admin account registration

import { z } from "zod";

export const adminRegisterSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters",
  }),
  officeNumber: z.string().optional(), // Converts to a number
  officeHours: z.string().optional(),
  officeLocation: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  creatorCode: z.string(), // Removed static validation
});

export type AdminRegisterSchema = z.infer<typeof adminRegisterSchema>;
//Removed from number checking from office num
// .length(10, { message: 'Office number must be exactly 10 digits' }) // Ensures 10-digit input
// .regex(/^\d+$/, { message: 'Office number must contain only digits' }) // Ensures it only contains digits
// .transform((val) => parseInt(val))
