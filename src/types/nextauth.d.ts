import NextAuth, { DefaultSession } from "next-auth"
import { DefaultJWT, JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User {
    email: string
    name: string
    role: string
    image: string
    id: number
  }

  interface Session extends DefaultSession {
    user: {
      email: string
      name: string
      role: string
      image: string
      id: number
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email: string
    name: string
    role: string
    image: string
    id: number
  }
}
