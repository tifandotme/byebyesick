import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequestWithAuth } from "next-auth/middleware"

const secret = process.env.NEXTAUTH_SECRET

export default async function middleware(req: NextRequestWithAuth) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req, secret })
  const adminPath = "/dashboard"
  const protectedPath = pathname.startsWith(adminPath)
  const isAuthenticated = !!token

  if (pathname.startsWith("/auth") && isAuthenticated) {
    if (token && token.user_role_id === 1) {
      return NextResponse.redirect(new URL("/dashboard/products", req.url))
    }
    if (token && token.user_role_id === 2) {
      return NextResponse.redirect(new URL("/dashboard/pharmacies", req.url))
    }
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (protectedPath) {
    if (!isAuthenticated) {
      const url = new URL(`/auth/login`, req.url)
      url.searchParams.set("callbackUrl", encodeURI(req.url))
      return NextResponse.redirect(url)
    }
    if (token.user_role_id !== 2 && token.user_role_id !== 1) {
      const url = new URL(`/403`, req.url)
      return NextResponse.rewrite(url)
    }
  } else {
    if (!isAuthenticated) {
      return NextResponse.next()
    }
    if (token.user_role_id !== 3 && token.user_role_id !== 4) {
      const url = new URL(`/403`, req.url)
      return NextResponse.rewrite(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/auth/:path*", "/dashboard/:path*", "/"],
}
