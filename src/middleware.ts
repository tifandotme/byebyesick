import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequestWithAuth } from "next-auth/middleware"

import {
  DOCTOR_ROLE,
  PATIENT_ROLE,
  PHARMACY_ADMIN_ROLE,
  SUPER_ADMIN_ROLE,
} from "./config"

const secret = process.env.NEXTAUTH_SECRET

export default async function middleware(req: NextRequestWithAuth) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req, secret })
  const doctorPath = "/doctor"
  const consultationPath = "/consultation"
  const profilePath = "/profile"
  const pharmaciesAdminPath = "/dashboard/pharmacies"
  const patientAdminPath = "/order"
  const superAdminPath = [
    "/dashboard/products",
    "/dashboard/users",
    "/dashboard/productcategories",
    "/dashboard/manufacturers",
    "/dashboard/transactions",
    "/dashboard/doctor-specs",
  ]
  const adminAndPharmacyAdminPath = [
    "/dashboard/sales-report",
    "/dashboard/orders",
  ]
  const patientAdminProtectedPath = pathname.startsWith(patientAdminPath)
  const doctorProtectedPath =
    pathname.startsWith(doctorPath) && !pathname.startsWith("/doctors")
  const pharmaciesAdminProtectedPath = pathname.startsWith(pharmaciesAdminPath)
  const superAdminProtectedPath = superAdminPath.some((path) =>
    pathname.startsWith(path),
  )
  const consultationBranchingPath = pathname === consultationPath
  const profileBranchingPath = pathname === profilePath
  const adminAndPharmacyAdminProtectedPath = adminAndPharmacyAdminPath.some(
    (path) => pathname.startsWith(path),
  )
  const isAuthenticated = !!token
  if (pathname.startsWith("/auth") && isAuthenticated) {
    if (token && token.user_role_id === SUPER_ADMIN_ROLE) {
      return NextResponse.redirect(
        new URL(
          process.env.NEXT_PUBLIC_SITE_PATH + "/dashboard/products",
          req.url,
        ),
      )
    }
    if (token && token.user_role_id === PHARMACY_ADMIN_ROLE) {
      return NextResponse.redirect(
        new URL(
          process.env.NEXT_PUBLIC_SITE_PATH + "/dashboard/pharmacies",
          req.url,
        ),
      )
    }
    if (token && token.user_role_id === DOCTOR_ROLE) {
      return NextResponse.redirect(
        new URL(process.env.NEXT_PUBLIC_SITE_PATH + "/doctor", req.url),
      )
    }
    return NextResponse.redirect(
      new URL(process.env.NEXT_PUBLIC_SITE_PATH + "/", req.url),
    )
  }
  if (superAdminProtectedPath) {
    if (!isAuthenticated) {
      const url = new URL(
        process.env.NEXT_PUBLIC_SITE_PATH + `/auth/login`,
        req.url,
      )
      url.searchParams.set("callbackUrl", req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    if (token.user_role_id !== SUPER_ADMIN_ROLE) {
      const url = new URL(process.env.NEXT_PUBLIC_SITE_PATH + `/403`, req.url)
      return NextResponse.rewrite(url)
    }
  } else if (patientAdminProtectedPath) {
    console.log("koko")
    if (!isAuthenticated) {
      const url = new URL(
        process.env.NEXT_PUBLIC_SITE_PATH + `/auth/login`,
        req.url,
      )
      url.searchParams.set("callbackUrl", req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    if (token.user_role_id === DOCTOR_ROLE) {
      const url = new URL(process.env.NEXT_PUBLIC_SITE_PATH + `/403`, req.url)
      return NextResponse.rewrite(url)
    }
  } else if (adminAndPharmacyAdminProtectedPath) {
    if (!isAuthenticated) {
      const url = new URL(
        process.env.NEXT_PUBLIC_SITE_PATH + `/auth/login`,
        req.url,
      )
      url.searchParams.set("callbackUrl", req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    if (
      token.user_role_id !== SUPER_ADMIN_ROLE &&
      token.user_role_id !== PHARMACY_ADMIN_ROLE
    ) {
      const url = new URL(process.env.NEXT_PUBLIC_SITE_PATH + `/403`, req.url)
      return NextResponse.rewrite(url)
    }
  } else if (doctorProtectedPath) {
    if (!isAuthenticated) {
      const url = new URL(
        process.env.NEXT_PUBLIC_SITE_PATH + `/auth/login`,
        req.url,
      )
      url.searchParams.set("callbackUrl", req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    if (token.user_role_id !== DOCTOR_ROLE) {
      const url = new URL(process.env.NEXT_PUBLIC_SITE_PATH + `/403`, req.url)
      return NextResponse.rewrite(url)
    }
  } else if (pharmaciesAdminProtectedPath) {
    if (!isAuthenticated) {
      const url = new URL(
        process.env.NEXT_PUBLIC_SITE_PATH + `/auth/login`,
        req.url,
      )
      url.searchParams.set("callbackUrl", req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    if (token.user_role_id !== PHARMACY_ADMIN_ROLE) {
      const url = new URL(process.env.NEXT_PUBLIC_SITE_PATH + `/403`, req.url)
      return NextResponse.rewrite(url)
    }
  } else if (consultationBranchingPath) {
    if (!isAuthenticated) {
      const url = new URL(
        process.env.NEXT_PUBLIC_SITE_PATH + `/auth/login`,
        req.url,
      )
      url.searchParams.set("callbackUrl", req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    if (token.user_role_id === DOCTOR_ROLE) {
      const url = new URL(
        process.env.NEXT_PUBLIC_SITE_PATH + `/consultation/as-doctor`,
        req.url,
      )
      return NextResponse.redirect(url)
    } else if (token.user_role_id === PATIENT_ROLE) {
      return NextResponse.redirect(
        new URL(
          process.env.NEXT_PUBLIC_SITE_PATH + "/consultation/as-patient",
          req.url,
        ),
      )
    } else {
      const url = new URL(process.env.NEXT_PUBLIC_SITE_PATH + `/403`, req.url)
      return NextResponse.rewrite(url)
    }
  } else if (profileBranchingPath) {
    if (!isAuthenticated) {
      const url = new URL(
        process.env.NEXT_PUBLIC_SITE_PATH + `/auth/login`,
        req.url,
      )
      url.searchParams.set("callbackUrl", req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
    if (token.user_role_id === DOCTOR_ROLE) {
      const url = new URL(
        process.env.NEXT_PUBLIC_SITE_PATH + `/doctor/profile`,
        req.url,
      )
      return NextResponse.redirect(url)
    } else if (token.user_role_id === PATIENT_ROLE) {
      return NextResponse.redirect(
        new URL(process.env.NEXT_PUBLIC_SITE_PATH + "/user/profile", req.url),
      )
    } else {
      const url = new URL(process.env.NEXT_PUBLIC_SITE_PATH + `/403`, req.url)
      return NextResponse.rewrite(url)
    }
  } else {
    if (isAuthenticated) {
      if (token.user_role_id === SUPER_ADMIN_ROLE) {
        return NextResponse.redirect(
          new URL(
            process.env.NEXT_PUBLIC_SITE_PATH + "/dashboard/products",
            req.url,
          ),
        )
      } else if (token.user_role_id === PHARMACY_ADMIN_ROLE) {
        return NextResponse.redirect(
          new URL(
            process.env.NEXT_PUBLIC_SITE_PATH + "/dashboard/pharmacies",
            req.url,
          ),
        )
      } else if (token.user_role_id === DOCTOR_ROLE) {
        return NextResponse.redirect(
          new URL(process.env.NEXT_PUBLIC_SITE_PATH + "/doctor", req.url),
        )
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/dashboard/:path*",
    "/",
    "/doctor/:path*",
    "/profile",
    "/consultation",
    "/doctors",
    "/order",
  ],
}
