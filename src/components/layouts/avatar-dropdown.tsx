import Link from "next/link"
import { useRouter } from "next/router"
import { ExitIcon } from "@radix-ui/react-icons"
import { signOut, useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

import CartSheet from "../checkout/cart-sheet"

interface AvatarDropdownProps {
  className?: string
}

export function AvatarDropdown({ className }: AvatarDropdownProps) {
  const router = useRouter()

  const { data: session, status } = useSession()

  const onLogout = async () => {
    await signOut({ redirect: false })
    router.replace("/auth/login")
  }

  const initials = session?.user.name.slice(0, 2).toUpperCase()

  return (
    <>
      {status === "loading" && (
        <Skeleton className={cn("size-10 rounded-full", className)} />
      )}
      {status === "authenticated" && session && (
        <>
          {session.user.user_role_id === 4 && <CartSheet />}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className={cn(
                  "relative size-10 select-none rounded-full border p-0",
                  className,
                )}
              >
                <Avatar className="size-full">
                  <AvatarImage
                    src={session.user.image}
                    alt={session.user.name}
                    className="object-cover "
                  />
                  {initials ? (
                    <AvatarFallback>
                      {session.user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  ) : (
                    <Icons.Person
                      className={cn(
                        "size-10 -translate-y-0.5 p-2 text-muted-foreground",
                        className,
                      )}
                    />
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-base font-semibold leading-none">
                    {session.user.name}
                  </p>
                  <p className="text-sm leading-none text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {session.user.user_role_id === 4 && (
                <>
                  <DropdownMenuGroup></DropdownMenuGroup>
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/user/profile" className="cursor-pointer">
                        <Icons.Avatar className="mr-2 size-4" />
                        Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/transactions" className="cursor-pointer">
                        <Icons.Transactions className="mr-2 size-4" />
                        My Transactions
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/order" className="cursor-pointer">
                        <Icons.ShoppingBag className="mr-2 size-4" />
                        My Order
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <button onClick={onLogout} className="w-full cursor-pointer">
                  <ExitIcon className="mr-2 size-4" />
                  Log out
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
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
    </>
  )
}
