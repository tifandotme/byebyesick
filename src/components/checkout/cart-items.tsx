import React from "react"
import Image from "next/image"
import { ImageIcon } from "lucide-react"

import type { ICart, ResponseGetAll } from "@/types/api"
import { cn, formatPrice } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { UpdateCart } from "@/components/checkout/update-cart-items"

interface CartLineItemsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: ResponseGetAll<ICart[]>
  isScrollable?: boolean
  isCheckable?: boolean
  checkedItems?: Record<number, boolean>
  onChecked?: (id: string, isChecked: boolean) => void
}

export function CartLineItems({
  items,
  isScrollable = true,
  isCheckable = true,
  onChecked,
  checkedItems,

  className,
  ...props
}: CartLineItemsProps) {
  return (
    <div className={cn("  w-full space-y-5", className)} {...props}>
      {items.data.items.map((item, index) => (
        <div key={index} className="space-y-3">
          <div className={cn("flex  justify-between ")}>
            <div className="flex items-center space-x-4">
              {isCheckable && (
                <Checkbox
                  checked={checkedItems?.[item.id] || false}
                  onCheckedChange={(isChecked) =>
                    onChecked && onChecked(String(item.id), Boolean(isChecked))
                  }
                  className="shrink-0"
                />
              )}
              <div className="relative aspect-square size-16 min-w-fit overflow-hidden rounded">
                {item?.product.image?.length ? (
                  <Image
                    src={
                      item.product.image ?? "/images/product-placeholder.webp"
                    }
                    alt={item.product.name ?? item.product.name}
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

              <div className="flex flex-col space-y-1 self-start">
                <span className="line-clamp-1 font-medium">
                  {item.product.name}
                </span>
                <span className="line-clamp-1 text-xs text-muted-foreground">
                  {formatPrice(Number(item.product.minimum_price))} -
                  {formatPrice(Number(item.product.maximum_price))}
                </span>
              </div>
            </div>
            {isCheckable ? (
              <>
                <div>
                  <span className="text-md mb-2 line-clamp-1 font-bold">
                    {formatPrice(Number(item.product.minimum_price))} -{" "}
                    {formatPrice(Number(item.product.maximum_price))}
                  </span>
                  <UpdateCart cartLineItem={item} />
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-1 font-medium"></div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
