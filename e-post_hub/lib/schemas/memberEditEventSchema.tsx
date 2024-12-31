import { z } from "zod";

export const editEventSchema = z.object({
  id: z.string().cuid(), // Ensure it's a valid unique ID
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  flyer: z.string().url().optional(),
  website: z.string().url().optional(),
});

export type EditEventSchema = z.infer<typeof editEventSchema>;
