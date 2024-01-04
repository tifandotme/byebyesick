import React from "react"

import MainNavbar from "@/components/navbar/mainNavbar"

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="sticky w-full">
        <MainNavbar />
      </div>
      <div className="container py-11">{children}</div>
    </div>
  )
}

export default MainLayout
