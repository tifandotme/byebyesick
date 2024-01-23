import React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { ShoppingCart } from "lucide-react"
import { signOut, useSession } from "next-auth/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { imageLoader } from "../image-loader"

function MainNavbar() {
  const { data: session, status } = useSession()
  const router = useRouter()
  return (
    <header className="border-b-2 border-b-primary bg-background">
      <div className="container py-2">
        <div className="flex items-center justify-between sm:gap-4">
          <Link href={"/"} className="flex items-center">
            <Image
              src="/logo.png"
              alt="Logo png"
              width={150}
              height={50}
              loader={imageLoader}
            />
          </Link>
          <div className="relative hidden translate-y-[2px] text-primary sm:flex sm:gap-3">
            <Link href={"#"}>Consultation</Link>
            <Link href={"#"}>Shop</Link>
            <Link href={"#"}>History</Link>
          </div>
          <div className="flex items-center justify-between gap-8 sm:justify-end lg:flex-1">
            {status === "authenticated" ? (
              <>
                <button type="button">
                  <ShoppingCart className="size-6 text-primary" />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <button
                      type="button"
                      className="group flex shrink-0 items-center rounded-lg"
                    >
                      <span className="sr-only">Menu</span>
                      <Image
                        alt="Man"
                        src={`${
                          session?.user.image !== ""
                            ? session?.user.image
                            : "https://cdn0.iconfinder.com/data/icons/communication-456/24/account_profile_user_contact_person_avatar_placeholder-512.png"
                        }`}
                        className="size-10 rounded-full object-cover"
                        loader={imageLoader}
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuLabel>
                      <div className="font-light">{session?.user.email}</div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href={`/profile/${session.user.user_id}`}>
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive"
                      onClick={() => {
                        signOut({ redirect: false }).then(() => {
                          router.replace("/auth/login")
                        })
                      }}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : status === "loading" ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <Link
                href={"/auth/login?callbackUrl=" + router.asPath}
                className="btn btn-ghost navbar-end w-fit text-base"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default MainNavbar
