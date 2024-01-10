import React from "react"
import Image from "next/image"

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
      <div className="flex w-full justify-center">{children}</div>
    </div>
  )
}

export default ResetPasswordLayout
