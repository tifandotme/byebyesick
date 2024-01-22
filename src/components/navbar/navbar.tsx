/* eslint-disable @next/next/no-img-element */

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { ExitIcon } from "@radix-ui/react-icons"
import { signOut, useSession } from "next-auth/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CartSheet from "@/components/checkout/cart-sheet"
import { Icons } from "@/components/icons"

function MainNavbar() {
  const router = useRouter()
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
          <div className="flex items-center space-x-2 sm:justify-end lg:flex-1">
            <CartSheet />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  className="relative size-8 select-none rounded-full"
                >
                  <Avatar>
                    <AvatarImage
                      alt="Man"
                      className="h-8 w-10"
                      src={session?.user.image}
                    />
                    <AvatarFallback>{session?.user.name}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session?.user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session?.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/user/profile" className="cursor-pointer">
                      <Icons.Avatar className="mr-2 size-4" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/item1" className="cursor-pointer">
                      <Icons.CreditCard className="mr-2 size-4" />
                      Item 1
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/item2" className="cursor-pointer">
                      <Icons.Gear className="mr-2 size-4" />
                      Item2
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button
                    onClick={() => {
                      signOut({ redirect: false }).then(() => {
                        router.replace("/auth/login")
                      })
                    }}
                    className="w-full cursor-pointer"
                  >
                    <ExitIcon className="mr-2 size-4" />
                    Log out
                  </button>
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
