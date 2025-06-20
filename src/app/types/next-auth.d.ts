import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      firstName?: string
      lastName?: string
      image?: string
    }
  }

  interface User {
    firstName?: string
    lastName?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    firstName?: string
    lastName?: string
  }
}