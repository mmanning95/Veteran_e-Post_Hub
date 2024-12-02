// Delete Event Schema
import { z } from "zod";

export const deleteEventSchema = z.object({
  eventId: z.string().nonempty("Event ID is required"), // Event ID required for deletion.
});

export type DeleteEventSchema = z.infer<typeof deleteEventSchema>;
