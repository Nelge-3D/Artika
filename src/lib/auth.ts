import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma" // ou ton chemin réel vers prisma client
import GoogleProvider from "next-auth/providers/google"
import type { AuthOptions } from "next-auth"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma), // ✅ obligatoire avec Prisma
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt", // ou "database" si tu veux stocker en BDD
  },

  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string
        session.user.firstName = token.firstName
        session.user.lastName = token.lastName
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.firstName = user.firstName
        token.lastName = user.lastName
      }
      return token
    },
  },

  pages: {
    signIn: "/dashboard",
    error: "/error", // tu peux créer une page custom pour éviter les messages bruts
  },
  debug: true,
}
