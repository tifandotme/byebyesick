import React from "react"
import Image from "next/image"

import doctor from "@/assets/backgrounds/doctor.svg"

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <div className="hidden w-1/2 flex-auto lg:block">
        <Image
          src={doctor}
          alt="Background"
          className="h-full w-full object-cover"
          width={1800}
          height={1800}
        />
      </div>
      <div className="container flex flex-auto items-center justify-center lg:w-1/2">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
