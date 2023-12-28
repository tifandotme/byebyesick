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
      <div className="container relative flex flex-auto flex-col lg:w-1/2 lg:items-center lg:justify-center">
        <Image
          className="absolute right-5 top-0 hidden lg:block"
          src="/logo.png"
          alt="Logo png"
          width={200}
          height={200}
        />
        <Image
          className="lg:hidden"
          src="/logo.png"
          alt="Logo png"
          width={200}
          height={200}
        />
        {children}
      </div>
    </div>
  )
}

export default AuthLayout
