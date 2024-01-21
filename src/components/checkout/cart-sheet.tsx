import React from "react"
import Link from "next/link"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { Loader2, ShoppingCart } from "lucide-react"

import { useCartList } from "@/lib/fetchers"
import { cn } from "@/lib/utils"
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

export default function CartSheet() {
  const { cartdata } = useCartList()
  if (!cartdata) return <Loader2 />
  const itemCount = cartdata?.data?.items.length ?? 0

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="Open cart"
          variant="outline"
          size="icon"
          className="relative"
        >
          {itemCount > 0 && (
            <Badge
              variant="secondary"
              className="absolute -right-2 -top-2 size-6 justify-center rounded-full p-2.5"
            >
              {itemCount}
            </Badge>
          )}
          <ShoppingCart className="size-4" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle>Cart {itemCount > 0 && `(${itemCount})`}</SheetTitle>

          <Separator />
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <CartLineItems
              items={cartdata}
              className="flex-1"
              isCheckable={false}
            />
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
          <div className="flex h-full flex-col items-center justify-center space-y-1">
            <ShoppingCart
              className="mb-4 size-16 text-muted-foreground"
              aria-hidden="true"
            />
            <div className="text-xl font-medium text-muted-foreground">
              Your cart is empty
            </div>
            <SheetTrigger asChild>
              <Link
                aria-label="Add items to your cart to checkout"
                href="/products"
                className={cn(
                  buttonVariants({
                    variant: "link",
                    size: "sm",
                    className: "text-sm text-muted-foreground",
                  }),
                )}
              >
                Add items to your cart to checkout
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
