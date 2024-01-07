import NextAuth, { DefaultSession } from "next-auth"
import { DefaultJWT, JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface User {
    email: string
    name: string
    user_role_id: number
    image: string
    user_id: number
    token: string
  }

  interface Session extends DefaultSession {
    user: {
      email: string
      name: string
      user_role_id: number
      image: string
      user_id: number
      token: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    email: string
    name: string
    user_role_id: number
    image: string
    user_id: number
    token: string
  }
}
