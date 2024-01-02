import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// import { type UserI } from '@/types/user';
// import { Login } from '@/features/auth/api/login';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials) {
        try {
          const { email, password } = credentials as {
            email: string
            password: string
          }
          // const login: UserI[] = await (await Login(email)).json()
          // if (login[0].password !== password) {
          //     return null
          // }
          // return login[0]
          if (email !== "user@gmail.com" || password !== "123456") {
            return null
          }
          return {
            id: 0,
            email: "user@gmail.com",
            image: "url",
            name: "John Doe",
            role: "User",
          }
        } catch (error) {
          const err = error as Error
          throw new Error(err.message)
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session?.user }
      }
      if (trigger === "signIn") {
        return { ...token, ...user }
      }
      return { ...token, ...user }
    },
    async session({ session, token }) {
      session.user = token
      return session
    },
  },
}

export default NextAuth(authOptions)
