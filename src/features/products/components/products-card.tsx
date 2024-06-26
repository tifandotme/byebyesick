import React from "react"
import Image from "next/image"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { mutate } from "swr"

import type { CartInputs } from "@/types"
import type { IProduct } from "@/types/api"
import { addToCart, useCartList } from "@/lib/fetchers"
import { cn, formatPrice, handleFailedRequest } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { imageLoader } from "@/components/image-loader"
import { PlaceholderImage } from "@/components/image-placeholer"

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: IProduct
}

export function ProductCard({
  product,
  className,
  ...props
}: ProductCardProps) {
  const { status } = useSession()
  const [isLoading, setIsLoading] = React.useState(false)
  const { cartMutate } = useCartList()

  const addToCartt = async (data: CartInputs) => {
    setIsLoading(true)

    const { success, message } = await addToCart(data)

    success ? toast.success(message) : toast.error(message)

    mutate(data)

    setIsLoading(false)
  }

  return (
    <Card
      className={cn("size-full overflow-hidden rounded-sm", className)}
      {...props}
    >
      <Link aria-label={product.name} href={`/products/${product.id}`}>
        <CardHeader className="border-b p-0">
          <AspectRatio ratio={4 / 3}>
            {product.image ? (
              <Image
                loader={imageLoader}
                src={product.image}
                loading="lazy"
                className="object-cover"
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                alt={product.image || product.name}
                fill
              />
            ) : (
              <PlaceholderImage className="rounded-none" asChild />
            )}
          </AspectRatio>
        </CardHeader>
      </Link>
      <Link href={`/products/${product.id}`} tabIndex={-1}>
        <CardContent className="space-y-1.5 p-4">
          <CardTitle className="mt-2 line-clamp-1 text-xl">
            {product.name}
          </CardTitle>
          <CardDescription className="line-clamp-1">
            {formatPrice(product.minimum_price)} -{" "}
            {formatPrice(product.maximum_price)}
          </CardDescription>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-1">
        <div className="flex w-full items-center space-x-2">
          <Button
            aria-label="Add to cart"
            size="sm"
            className="h-8 w-full rounded-sm"
            onClick={async () => {
              try {
                await addToCartt({ product_id: product.id, quantity: 1 })
                cartMutate()
              } catch (error) {
                const Error = error as unknown as Response
                handleFailedRequest(Error)
              }
            }}
            disabled={isLoading || status === "unauthenticated"}
          >
            {isLoading && (
              <Icons.Spinner className="mr-2 size-4 animate-spin" />
            )}
            Add to cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
