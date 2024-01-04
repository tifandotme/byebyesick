/* eslint-disable @next/next/no-img-element */

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { EyeOpenIcon } from "@radix-ui/react-icons"
import { CheckCheckIcon, PlusCircleIcon } from "lucide-react"
import { toast } from "sonner"

import type { ProductsSchema } from "@/types/api"
import { cn, formatPrice } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PlaceholderImage } from "@/components/image-placeholer"
import Loader from "@/components/loader"

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: ProductsSchema
  variant?: "default" | "switchable"
  isAddedToCart?: boolean
  onSwitch?: () => Promise<void>
}

export function ProductCard({
  product,
  variant = "default",
  isAddedToCart = false,
  onSwitch,
  className,
  ...props
}: ProductCardProps) {
  const [isAddingToCart, startAddingToCart] = React.useTransition()

  return (
    <Card
      className={cn("h-full w-full overflow-hidden rounded-sm", className)}
      {...props}
    >
      <Link
        aria-label={product.data.name}
        href={`/products/${product.data.id}`}
      >
        <CardHeader className="border-b p-0">
          <AspectRatio ratio={4 / 3}>
            {product.data.image?.length ? (
              <Image
                src={product.data.image ?? "/images/product-placeholder.webp"}
                loading="lazy"
                className="object-cover"
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                alt={product.data.image ?? product.data.name}
                fill
              />
            ) : (
              <PlaceholderImage className="rounded-none" asChild />
            )}
          </AspectRatio>
        </CardHeader>
        <span className="sr-only">{product.data.name}</span>
      </Link>
      <Link href={`/products/${product.data.id}`} tabIndex={-1}>
        <CardContent className="space-y-1.5 p-4">
          <CardTitle className="mt-2 line-clamp-1 ">
            {product.data.name}
          </CardTitle>
          <CardDescription className="line-clamp-1">
            {formatPrice(product.data.price)}
          </CardDescription>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-1">
        {variant === "default" ? (
          <div className="flex w-full items-center space-x-2">
            <Button
              aria-label="Add to cart"
              size="sm"
              className="h-8 w-full rounded-sm"
              //   onClick={() => {
              //     startAddingToCart(async () => {
              //       try {
              //         await addToCart({
              //           productId: product.data.id,
              //           quantity: 1,
              //         })
              //         toast.success("Added to cart.")
              //       } catch (err) {
              //         catchError(err)
              //       }
              //     })
              //   }}
              disabled={isAddingToCart}
            >
              {isAddingToCart && <Loader />}
              Add to cart
            </Button>
            <Link
              href={`/products/${product.data.id}`}
              title="Preview"
              className={cn(
                buttonVariants({
                  variant: "secondary",
                  size: "icon",
                  className: "h-8 w-8 shrink-0",
                }),
              )}
            >
              <EyeOpenIcon className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Preview</span>
            </Link>
          </div>
        ) : (
          <Button
            aria-label={isAddedToCart ? "Remove from cart" : "Add to cart"}
            size="sm"
            className="h-8 w-full rounded-sm"
            onClick={() => {
              startAddingToCart(async () => {
                await onSwitch?.()
              })
            }}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <Loader />
            ) : isAddedToCart ? (
              <CheckCheckIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            ) : (
              <PlusCircleIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {isAddedToCart ? "Added" : "Add to cart"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
