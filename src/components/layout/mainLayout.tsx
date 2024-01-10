import React from "react"

import { SiteFooter } from "@/components/layouts/site-footer"
import MainNavbar from "@/components/navbar/mainNavbar"

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col overflow-auto">
      <div className="sticky w-full">
        <MainNavbar />
      </div>
      <div className="container max-w-6xl grow py-11">{children}</div>
      <SiteFooter />
    </div>
  )
}

export default MainLayout
