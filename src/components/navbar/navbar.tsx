import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"

function MainNavbar() {
  return (
    <header className="border-b-2 border-b-apple-300 bg-background">
      <div className="container py-2">
        <div className="flex items-center justify-between sm:gap-4">
          <Link href={"/"} className="flex items-center">
            <Image src="/logo.png" alt="Logo png" width={150} height={50} />
          </Link>
          <div className="relative hidden translate-y-[2px] text-primary sm:flex sm:gap-3">
            <Link href={"#"}>Consultation</Link>
            <Link href={"#"}>Shop</Link>
            <Link href={"#"}>History</Link>
          </div>
          <div className="flex items-center justify-between gap-8 sm:justify-end lg:flex-1">
            <button type="button">
              <ShoppingCart className="h-7 w-7 text-primary" />
            </button>
            <button
              type="button"
              className="group flex shrink-0 items-center rounded-lg transition"
            >
              <span className="sr-only">Menu</span>
              <img
                alt="Man"
                src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
                className="h-10 w-10 rounded-full object-cover"
              />
              <p className="ms-2 hidden text-left text-xs sm:block">
                <strong className="block font-medium">Eric Frusciante</strong>

                <span className="text-gray-500"> eric@frusciante.com </span>
              </p>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default MainNavbar
