import type { DefaultSession } from "next-auth"
import type { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      firstName?: string
      lastName?: string
    } & DefaultSession["user"]
  }

  interface User {
    firstName?: string
    lastName?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    firstName?: string
    lastName?: string
  }
}
