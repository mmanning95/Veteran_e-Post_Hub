//Schema used to accept inputs for member account registaration

import { z } from "zod";

export const memberRegisterSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters",
  }),
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

export type MemberRegisterSchema = z.infer<typeof memberRegisterSchema>;
