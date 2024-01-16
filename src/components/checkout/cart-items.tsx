import React from "react"
import Image from "next/image"
import { ImageIcon } from "lucide-react"

import type { ICart, ResponseGetAll } from "@/types/api"
import { cn, formatPrice } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
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
    <div
      className={cn(
        "flex w-full flex-col gap-5",
        isScrollable && "pr-6",
        className,
      )}
      {...props}
    >
      {items.data.items.map((item, index) => (
        <div key={index} className="space-y-3">
          <div
            className={cn(
              "flex items-start justify-between gap-4",
              isCheckable && "flex-col xs:flex-row",
            )}
          >
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
              <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
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
                {isCheckable ? (
                  <span className="line-clamp-1 text-xs text-muted-foreground">
                    {formatPrice(Number(item.product.maximum_price))}
                  </span>
                ) : (
                  <span className="line-clamp-1 text-xs text-muted-foreground">
                    Qty {item.quantity}
                  </span>
                )}
              </div>
            </div>
            {isCheckable ? (
              <UpdateCart cartLineItem={item} />
            ) : (
              <div className="flex flex-col space-y-1 font-medium">
                <span className="ml-auto line-clamp-1 text-sm">
                  {formatPrice(item.product.maximum_price)}
                </span>
                <span className="line-clamp-1 text-xs text-muted-foreground">
                  {formatPrice(Number(item.product.minimum_price))} -{" "}
                  {formatPrice(Number(item.product.maximum_price))}
                </span>
              </div>
            )}
          </div>
          <Separator />
        </div>
      ))}
    </div>
  )
}
