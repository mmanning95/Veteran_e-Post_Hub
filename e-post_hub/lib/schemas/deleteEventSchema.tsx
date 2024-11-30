// Delete Event Schema
import { z } from "zod";

export const deleteEventSchema = z.object({
  eventId: z.string().nonempty("Event ID is required"),
});

export type DeleteEventSchema = z.infer<typeof deleteEventSchema>;
