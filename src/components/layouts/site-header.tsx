import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { ExitIcon } from "@radix-ui/react-icons"
import { signOut, useSession } from "next-auth/react"

import avatarImg from "@/assets/images/avatar.webp"
import { Avatar } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"
import { MobileNav } from "@/components/layouts/mobile-nav"

export function SiteHeader() {
  const router = useRouter()

  const { data: session, status } = useSession()

  const onLogout = async () => {
    await signOut({ redirect: false })

    router.replace("/auth/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <MobileNav />

        <div className="hidden gap-6 md:flex">
          <Link
            href="/"
            className="flex items-center space-x-2 text-apple-600 dark:text-apple-400"
          >
            <Icons.Logo className="h-6 w-6" />
            <span className="font-bold">
              <span>Bye</span>
              <span>Bye</span>
              <span className="text-red-600 dark:text-red-400">Sick</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {status === "loading" && (
              <Skeleton className="h-8 w-8 rounded-full" />
            )}
            {status === "authenticated" && session && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="relative h-8 w-8 select-none rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <Image src={avatarImg} alt={session.user.name} priority />
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/account"
                        className="cursor-pointer"
                      >
                        <Icons.Avatar className="mr-2 h-4 w-4" />
                        Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/dashboard/pharmacies"
                        className="cursor-pointer"
                      >
                        <Icons.Pharmacies className="mr-2 h-4 w-4" />
                        Pharmacies
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
                    <button
                      onClick={onLogout}
                      className="w-full cursor-pointer"
                    >
                      <ExitIcon className="mr-2 h-4 w-4" />
                      Log out
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {status === "unauthenticated" && (
              <Link
                href="/auth/login"
                className={buttonVariants({
                  size: "sm",
                })}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
