import React from "react"
import Image from "next/image"

import { Card } from "@/components/ui/card"

function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <Image
        src="/logo.png"
        alt="Logo png"
        width={150}
        className="-translate-y-5"
        height={50}
      />
      <Card className="w-full max-w-lg -translate-y-5 p-5">{children}</Card>
    </div>
  )
}

export default ResetPasswordLayout
