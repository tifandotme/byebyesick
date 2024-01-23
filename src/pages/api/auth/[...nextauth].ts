import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

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
          const resp = await fetch(
            `${process.env.NEXT_PUBLIC_DB_URL}/v1/auth/login`,
            {
              method: "POST",
              body: JSON.stringify({
                email,
                password,
              }),
            },
          )
          const parsedResponse = await resp.json()
          if (!resp.ok || resp.status !== 200) {
            return null
          }
          return parsedResponse.data
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
      return { ...token, ...user }
    },
    async session({ session, token }) {
      session.user = token
      return session
    },
  },
}

export default NextAuth(authOptions)
