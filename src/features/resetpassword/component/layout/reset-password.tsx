import React from "react"

import { Card } from "@/components/ui/card"

function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-row items-center justify-center">
      <Card>{children}</Card>
    </div>
  )
}

export default ResetPasswordLayout
