import React from "react"
import { toast } from "sonner"
import { mutate } from "swr"

import type { CartInputs } from "@/types"
import type { PrescriptionProduct } from "@/types/api"
import { addToCart, useCartList } from "@/lib/fetchers"
import { handleFailedRequest } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function AddToCart(product: PrescriptionProduct) {
  const [quantity, setQuantity] = React.useState(1)
  const [isLoading, setIsLoading] = React.useState(false)
  const { cartMutate } = useCartList()
  const addToCartHandler = async (data: CartInputs) => {
    setIsLoading(true)
    const { success, message } = await addToCart(data)
    success ? toast.success(message) : toast.error(message)
    mutate(data)
    setIsLoading(false)
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="w-fit p-0 font-semibold text-primary hover:underline"
        >
          Add to cart
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="mb-2 space-y-2">
          <h4 className="font-medium leading-none">Quantity</h4>
          <p className="text-sm text-muted-foreground">Enter Drug quantity</p>
        </div>
        <div className="grid grid-cols-1 items-center gap-4">
          <Input
            className="w-full"
            onChange={(e) => {
              setQuantity(parseInt(e.target.value))
            }}
          />
          <Button
            disabled={isLoading}
            onClick={async () => {
              try {
                await addToCartHandler({
                  product_id: product.product_id,
                  quantity: quantity,
                })
                cartMutate()
              } catch (error) {
                const Error = error as unknown as Response
                handleFailedRequest(Error)
              }
            }}
          >
            Submit
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default AddToCart
