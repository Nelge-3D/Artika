import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import type { AuthOptions } from "next-auth"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
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
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Vérifier si l'utilisateur existe
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user || !user.password) {
            return null
          }

          // Vérifier le mot de passe
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
          }
        } catch (error) {
          console.error("Erreur lors de l'authentification:", error)
          return null
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "database", // Utiliser la base de données avec Prisma
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },

  callbacks: {
    async session({ session, user }) {
      if (session?.user && user) {
        session.user.id = user.id
        session.user.firstName = user.firstName
        session.user.lastName = user.lastName
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Permettre la connexion pour tous les providers
      return true
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      if (isNewUser) {
        console.log("Nouvel utilisateur créé:", user.email)
      }
    },
  },

  debug: process.env.NODE_ENV === "development",
}