import Image from "next/image"
import { Slot } from "@radix-ui/react-slot"
import { ImageIcon } from "lucide-react"
import { z } from "zod"

// import type { CartLineItem } from "@/types"
import { cn, formatPrice } from "@/lib/utils"
import type { productSchema } from "@/lib/validations/products-schema"
import { ScrollArea } from "@/components/ui/scroll-area"

// import { UpdateCart } from "@/components/checkout/update-cart"

export type CartLineItem = z.infer<typeof productSchema>

interface CartLineItemsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: CartLineItem[]
  isScrollable?: boolean
  isEditable?: boolean
}

export function CartLineItems({
  items,
  isScrollable = true,
  isEditable = true,
  className,
  ...props
}: CartLineItemsProps) {
  const Comp = isScrollable ? ScrollArea : Slot

  return (
    <Comp className="h-full">
      <div
        className={cn(
          "flex w-full flex-col gap-5",
          isScrollable && "pr-6",
          className,
        )}
        {...props}
      >
        {items.map((item, index) => (
          <div key={index} className="space-y-3">
            <div
              className={cn(
                "flex items-start justify-between gap-4",
                isEditable && "flex-col xs:flex-row",
              )}
            >
              <div className="flex items-center space-x-4">
                <div className="relative aspect-square h-16 w-16 min-w-fit overflow-hidden rounded">
                  {item?.image?.length ? (
                    <Image
                      src={item.image ?? "/images/product-placeholder.webp"}
                      alt={item.name ?? item.name}
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
                    {item.name}
                  </span>
                  {/* {isEditable ? (
                    <span className="text-xs line-clamp-1 text-muted-foreground">
                      {formatPrice(item.price)} x {item.quantity} ={" "}
                      {formatPrice(
                        (Number(item.price) * Number(item.quantity)).toFixed(2),
                      )}
                    </span>
                  ) : (
                    <span className="text-xs line-clamp-1 text-muted-foreground">
                      Qty {item.quantity}
                    </span>
                  )} */}
                  {/* <span className="text-xs capitalize line-clamp-1 text-muted-foreground">
                    {`${item.category} ${
                      item.subcategory ? `/ ${item.subcategory}` : ""
                    }`}
                  </span> */}
                </div>
              </div>
              {isEditable ? (
                // <UpdateCart cartLineItem={item} />
                <div></div>
              ) : (
                <div className="flex flex-col space-y-1 font-medium">
                  <span className="ml-auto line-clamp-1 text-sm">
                    {/* {formatPrice(
                      (Number(item.price) * item.quantity).toFixed(2),
                    )} */}
                  </span>
                  <span className="line-clamp-1 text-xs text-muted-foreground">
                    {formatPrice(item.price)} each
                  </span>
                </div>
              )}
            </div>
            {/* {variant === "default" ? <Separator /> : null} */}
          </div>
        ))}
      </div>
    </Comp>
  )
}
