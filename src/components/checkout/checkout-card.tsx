import React from "react"
import Image from "next/image"
import { ImageIcon, Loader2 } from "lucide-react"

import type { ICart, ResponseGetAll } from "@/types/api"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

interface CheckoutCardProps {
  item: ICart
}

export function CheckoutCard({ item }: CheckoutCardProps) {
  const [isChecked, setIsChecked] = React.useState(false)
  const toggleCheckbox = () => setIsChecked(!isChecked)

  return (
    <Card className="mb-2">
      <CardHeader className="flex flex-row items-center space-x-4 py-4">
        <Checkbox
          checked={isChecked}
          onCheckedChange={toggleCheckbox}
          className="shrink-0"
        />
        <CardTitle className="line-clamp-1 flex-1">
          {item.product.name}
        </CardTitle>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent className="pb-6 pl-6 pr-0">
        <CardDescription>
          <div className="flex items-center space-x-4">
            <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
              {item?.product.image?.length ? (
                <Image
                  src={item.product.image ?? "/images/product-placeholder.webp"}
                  alt={item.product.name ?? item.product.name}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fill
                  className="absolute object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-secondary">
                  <ImageIcon
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-1 self-start">
              <span className="line-clamp-1 text-sm font-medium">
                {item.product.name}
              </span>

              <span className="line-clamp-1 text-xs text-muted-foreground">
                {/* {formatPrice(item.product.maximum_price)} x{" "}
                      {item.quantity} ={" "}
                      {formatPrice(
                        (
                          Number(item.product.maximum_price) *
                          Number(item.quantity)
                        ).toFixed(2),
                      )} */}
              </span>
            </div>
          </div>
        </CardDescription>
      </CardContent>
      <Separator className="mb-4" />
      <CardFooter className="space-x-4">
        <span className="flex-1">
          {/* Total ({cartLineItems.reduce((acc, item) => acc + item.quantity, 0)}) */}
        </span>
        <span>
          {/* {formatPrice(
            cartLineItems.reduce(
              (acc, item) => acc + Number(item.price) * item.quantity,
              0,
            ),
          )} */}
        </span>
      </CardFooter>
    </Card>
  )
}
