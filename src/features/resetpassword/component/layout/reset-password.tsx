import React from "react"

import { Card } from "@/components/ui/card"

function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-row items-center justify-center">
      <Card className="w-full max-w-2xl p-5">{children}</Card>
    </div>
  )
}

export default ResetPasswordLayout
