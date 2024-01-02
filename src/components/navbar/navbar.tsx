import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ExitIcon } from "@radix-ui/react-icons"
import { ShoppingCart } from "lucide-react"

import { Avatar } from "@/components/ui/avatar"
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

            {/* <ShoppingCart className="w-6 h-6 text-primary" /> */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  className="relative h-8 w-8 select-none rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <Image
                      src={`/favicon.ico`}
                      alt="aaaa"
                      priority
                      className="h-10 w-10 rounded-full object-cover"
                      width={10}
                      height={10}
                    />
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {/* {user.name} */}
                      Yafi
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {/* {user.email} */}
                      rawr@gmail.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/account" className="cursor-pointer">
                      <Icons.Avatar className="mr-2 h-4 w-4" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/item1" className="cursor-pointer">
                      <Icons.CreditCard className="mr-2 h-4 w-4" />
                      Item 1
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/item2" className="cursor-pointer">
                      <Icons.Gear className="mr-2 h-4 w-4" />
                      Item2
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <button className="w-full cursor-pointer">
                    <ExitIcon className="mr-2 h-4 w-4" />
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
