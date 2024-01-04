import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useSession } from "next-auth/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function MainNavbar() {
  const { data: session } = useSession()
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
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button
                  type="button"
                  className="group flex shrink-0 items-center rounded-lg"
                >
                  <span className="sr-only">Menu</span>
                  <img
                    alt="Man"
                    src={`${
                      session?.user.image !== ""
                        ? session?.user.image
                        : "https://cdn0.iconfinder.com/data/icons/communication-456/24/account_profile_user_contact_person_avatar_placeholder-512.png"
                    }`}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <p className="ms-2 hidden text-left text-xs sm:block">
                    <strong className="block font-medium">
                      {session?.user.email}
                    </strong>
                  </p>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-destructive">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

export default MainNavbar
