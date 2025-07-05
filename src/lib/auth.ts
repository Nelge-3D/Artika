import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma" // ou ton chemin réel vers prisma client
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import type { AuthOptions } from "next-auth"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma), // ✅ obligatoire avec Prisma
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          image: user.image || undefined,
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "database", // Utilise la base de données avec PrismaAdapter
  },

  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        session.user.id = user.id
        session.user.firstName = user.firstName
        session.user.lastName = user.lastName
      }
      return session
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  debug: true,
}