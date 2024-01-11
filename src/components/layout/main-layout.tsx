import React from "react"

import { SiteFooter } from "@/components/layouts/site-footer"
import MainNavbar from "@/components/navbar/navbar"

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <MainNavbar />
      <div className="container max-w-6xl ">{children}</div>
      <SiteFooter />
    </div>
  )
}

export default MainLayout
