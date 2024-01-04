import React from "react"
import Image from "next/image"
import Link from "next/link"

import doctor from "@/assets/backgrounds/doctor.svg"

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen min-h-screen w-full flex-col lg:flex-row">
      <Link href={"/"} className="absolute lg:hidden">
        <Image
          className="lg:hidden"
          src="/logo.png"
          alt="Logo png"
          width={150}
          height={50}
        />
      </Link>
      <div className="h-1/2 flex-auto lg:h-full">
        <Image
          src={doctor}
          alt="Background"
          className="container h-full w-full object-cover"
          width={1800}
          height={1800}
        />
      </div>
      <div className="container relative flex h-1/2 flex-auto flex-col lg:h-full lg:w-1/2">
        <Link href={"/"} className="absolute right-5 top-0 hidden lg:block">
          <Image src="/logo.png" alt="Logo png" width={200} height={100} />
        </Link>
        <div className="my-5 flex h-full w-full flex-col items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
