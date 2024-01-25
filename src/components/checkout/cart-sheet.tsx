import Link from "next/link"
import { useRouter } from "next/router"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { ShoppingCart } from "lucide-react"

import { useCartList } from "@/lib/fetchers"
import { cn } from "@/lib/utils"
import { useWindowScroll } from "@/hooks/use-window-scroll"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CartLineItems } from "@/components/checkout/cart-items"

import { Icons } from "../icons"

export default function CartSheet() {
  const router = useRouter()
  const { y } = useWindowScroll()
  const isHomePage = router.pathname === "/"
  const isScrolled = y > 100

  const { cartdata } = useCartList()

  const itemCount = cartdata?.data?.items.length ?? 0

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          disabled={!cartdata}
          className={cn(
            "relative size-9 rounded-md bg-transparent text-foreground",
            isHomePage &&
              !isScrolled &&
              "border-0 text-background drop-shadow-md hover:bg-transparent hover:text-background/70",
          )}
        >
          {itemCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -right-2 -top-2 size-6 justify-center rounded-full p-2.5"
            >
              {itemCount}
            </Badge>
          )}
          <Icons.Cart
            className={cn(
              "size-4 transition-[height,_width]",
              isHomePage && !isScrolled && "size-5",
            )}
            aria-hidden="true"
          />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Cart {itemCount > 0 && `(${itemCount})`}</SheetTitle>

          <Separator />
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            {cartdata && (
              <CartLineItems
                items={cartdata}
                className="flex-1"
                isCheckable={false}
              />
            )}
            <div className="space-y-4 pr-6">
              <Separator />

              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    aria-label="View your cart"
                    href="/cart"
                    className={buttonVariants({
                      size: "sm",
                      className: "w-full",
                    })}
                  >
                    View your cart
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center">
            <div className="flex select-none flex-col items-center">
              <ShoppingCart
                className="mb-4 size-16 text-muted-foreground"
                aria-hidden="true"
              />
              <div className="text-xl font-medium text-muted-foreground">
                Your cart is empty
              </div>
            </div>
            <SheetTrigger asChild>
              <Link
                href="/products/around-you"
                className={cn(
                  buttonVariants({
                    variant: "link",
                    size: "sm",
                    className: "mt-10 text-sm",
                  }),
                )}
              >
                Browse for products
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
