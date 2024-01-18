import React from "react"
import Image from "next/image"
import Link from "next/link"
import { EyeOpenIcon } from "@radix-ui/react-icons"
import { LoaderIcon } from "lucide-react"
import { toast } from "sonner"
import { mutate } from "swr"

import type { CartInputs } from "@/types"
import type { IProduct } from "@/types/api"
import { addToCart, useCartList } from "@/lib/fetchers"
import { cn, formatPrice, handleFailedRequest } from "@/lib/utils"
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

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  product: IProduct
}

export function ProductCard({
  product,
  className,
  ...props
}: ProductCardProps) {
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
            {product.image?.length ? (
              <Image
                src={product.image ?? "/images/product-placeholder.webp"}
                loading="lazy"
                className="object-cover"
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                alt={product.image ?? product.name}
                fill
              />
            ) : (
              <PlaceholderImage className="rounded-none" asChild />
            )}
          </AspectRatio>
        </CardHeader>
        <span className="sr-only">{product.name}</span>
      </Link>
      <Link href={`/products/${product.id}`} tabIndex={-1}>
        <CardContent className="space-y-1.5 p-4">
          <CardTitle className="mt-2 line-clamp-1 ">{product.name}</CardTitle>
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
            disabled={isLoading}
          >
            {isLoading && <LoaderIcon className="" />}
            Add to cart
          </Button>
          <Link
            href={`/products/${product.id}`}
            title="Preview"
            className={cn(
              buttonVariants({
                variant: "secondary",
                size: "icon",
                className: "h-8 w-8 shrink-0",
              }),
            )}
          >
            <EyeOpenIcon className="size-4" aria-hidden="true" />
            <span className="sr-only">Preview</span>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
