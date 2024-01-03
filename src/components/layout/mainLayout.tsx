import React from "react"

import { SiteFooter } from "@/components/layouts/site-footer"
import MainNavbar from "@/components/navbar/navbar"

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="sticky w-full">
        <MainNavbar />
      </div>
      <div className="container py-11">{children}</div>
      <SiteFooter />
    </div>
  )
}

export default MainLayout
