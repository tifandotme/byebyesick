import React from "react"

import { SiteLogo } from "@/components/site-logo"

function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <SiteLogo />
      {children}
    </div>
  )
}

export default ResetPasswordLayout
