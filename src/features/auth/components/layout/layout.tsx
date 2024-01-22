import React from "react"
import Image from "next/image"
import Link from "next/link"

import doctor from "@/assets/backgrounds/doctor.svg"
import { SiteLogo } from "@/components/site-logo"

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen min-h-screen w-full flex-col overflow-y-auto lg:flex-row">
      <Link href={"/"} className=" absolute left-5 top-5 lg:hidden">
        <SiteLogo />
      </Link>
      <div className="hidden h-1/2 flex-auto xl:block xl:h-full">
        <Image
          src={doctor}
          alt="Background"
          className="container size-full object-cover"
          width={1800}
          height={1800}
        />
      </div>
      <div className="container relative flex  flex-auto flex-col xl:h-full xl:w-1/2">
        <Link href={"/"} className="absolute right-5 top-5 hidden lg:block">
          <SiteLogo />
        </Link>
        <div className="my-5 flex size-full flex-col items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
