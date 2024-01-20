import React from "react"

import { SiteFooter } from "@/components/layouts/site-footer"
import MainNavbar from "@/components/navbar/navbar"

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen min-h-screen flex-col">
      <div className="sticky w-full">
        <MainNavbar />
      </div>
      <div className="container max-w-6xl grow">{children}</div>
      <SiteFooter />
    </div>
  )
}

export default MainLayout
