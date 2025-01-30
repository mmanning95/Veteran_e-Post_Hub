import { z } from "zod";

export const createEventSchema = z
  .object({
    website: z.string().url(),
    title: z.string(),
    type: z.string(),
    startDate: z.string(), // date should be given as mm/dd/yyyy
    endDate: z.string(),
    startTime: z.string(), //  time should be provided as a string in "HH:MM AM/PM" format
    endTime: z.string(),
    description: z.string(),
    flyer: z.string(), //flyer is a URL or file path, may change later
    address: z.string(),
  })
  .refine((data) => data.description || data.flyer, {
    message: "Either description or flyer must be provided.",
    path: ["description", "flyer"], // This ensures the error appears on either field if missing
  });

export type CreateEventSchema = z.infer<typeof createEventSchema>;
