import React from "react"
import Image from "next/image"
import { ImageIcon } from "lucide-react"

import type { ICheckout } from "@/types/api"
import { formatPrice } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface CheckoutCardProps {
  item: ICheckout
}

export function CheckoutCard({ item }: CheckoutCardProps) {
  return (
    <Card className="mb-2">
      <Separator className="mb-4" />
      <CardContent className="pb-6 pl-6 pr-0">
        <CardDescription>
          <div className="flex items-center space-x-4">
            <div className="relative aspect-square size-16 min-w-fit overflow-hidden rounded">
              {item?.product.image?.length ? (
                <Image
                  src={item.product.image ?? "/images/product-placeholder.webp"}
                  alt={item.product.name}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                  className="absolute object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-secondary">
                  <ImageIcon
                    className="size-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>

            <div className="space-y-1 self-start ">
              <span className="line-clamp-1 text-lg text-black">
                {item.product.name}
              </span>

              <span className="line-clamp-1 text-sm text-muted-foreground">
                {item.quantity} x {formatPrice(item.pharmacy_product.price)}
              </span>
              <span className="line-clamp-1 text-sm text-muted-foreground">
                per {item.product.selling_unit}
              </span>
            </div>
          </div>
        </CardDescription>
      </CardContent>
      <Separator className="mb-4" />
      <CardFooter className="space-x-4"></CardFooter>
    </Card>
  )
}
