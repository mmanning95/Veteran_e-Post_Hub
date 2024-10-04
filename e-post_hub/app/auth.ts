import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import authConfig from "./auth.config"
import { prisma } from "./lib/schemas/prisma"

export const { handlers, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {strategy: "jwt" },
    ...authConfig,
})






// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [],
// })