import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequestWithAuth } from "next-auth/middleware"

import { DOCTOR_ROLE, PHARMACY_ADMIN_ROLE, SUPER_ADMIN_ROLE } from "./config"

const secret = process.env.NEXTAUTH_SECRET

export default async function middleware(req: NextRequestWithAuth) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req, secret })

  const doctorPath = "/doctor"
  const pharmaciesAdminPath = "/dashboard/pharmacies"
  const superAdminPath = [
    "/dashboard/products",
    "/dashboard/users",
    "/dashboard/productcategories",
    "/dashboard/manufacturers",
  ]
  const adminAndPharmacyAdminPath = "/dashboard/sales-report"

  const doctorProtectedPath = pathname.startsWith(doctorPath)
  const pharmaciesAdminProtectedPath = pathname.startsWith(pharmaciesAdminPath)
  const superAdminProtectedPath = superAdminPath.some((path) =>
    pathname.startsWith(path),
  )
  const adminAndPharmacyAdminProtectedPath = pathname.startsWith(
    adminAndPharmacyAdminPath,
  )

  const isAuthenticated = !!token

  if (pathname.startsWith("/auth") && isAuthenticated) {
    if (token && token.user_role_id === SUPER_ADMIN_ROLE) {
      return NextResponse.redirect(new URL("/dashboard/products", req.url))
    }
    if (token && token.user_role_id === PHARMACY_ADMIN_ROLE) {
      return NextResponse.redirect(new URL("/dashboard/pharmacies", req.url))
    }
    if (token && token.user_role_id === DOCTOR_ROLE) {
      return NextResponse.redirect(new URL("/doctor", req.url))
    }
    return NextResponse.redirect(new URL("/", req.url))
  }
  if (superAdminProtectedPath) {
    if (!isAuthenticated) {
      const url = new URL(`/auth/login`, req.url)
      url.searchParams.set("callbackUrl", req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    if (token.user_role_id !== SUPER_ADMIN_ROLE) {
      const url = new URL(`/403`, req.url)
      return NextResponse.rewrite(url)
    }
  } else if (adminAndPharmacyAdminProtectedPath) {
    if (!isAuthenticated) {
      const url = new URL(`/auth/login`, req.url)
      url.searchParams.set("callbackUrl", req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    if (
      token.user_role_id !== SUPER_ADMIN_ROLE &&
      token.user_role_id !== PHARMACY_ADMIN_ROLE
    ) {
      const url = new URL(`/403`, req.url)
      return NextResponse.rewrite(url)
    }
  } else if (doctorProtectedPath) {
    if (!isAuthenticated) {
      const url = new URL(`/auth/login`, req.url)
      url.searchParams.set("callbackUrl", req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    if (token.user_role_id !== DOCTOR_ROLE) {
      const url = new URL(`/403`, req.url)
      return NextResponse.rewrite(url)
    }
  } else if (pharmaciesAdminProtectedPath) {
    if (!isAuthenticated) {
      const url = new URL(`/auth/login`, req.url)
      url.searchParams.set("callbackUrl", req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    if (token.user_role_id !== PHARMACY_ADMIN_ROLE) {
      const url = new URL(`/403`, req.url)
      return NextResponse.rewrite(url)
    }
  } else {
    if (isAuthenticated) {
      if (token.user_role_id === SUPER_ADMIN_ROLE) {
        return NextResponse.redirect(new URL("/dashboard/products", req.url))
      } else if (token.user_role_id === PHARMACY_ADMIN_ROLE) {
        return NextResponse.redirect(new URL("/dashboard/pharmacies", req.url))
      } else if (token.user_role_id === DOCTOR_ROLE) {
        return NextResponse.redirect(new URL("/doctor", req.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/auth/:path*", "/dashboard/:path*", "/", "/doctor/:path*"],
}
