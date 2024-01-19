import * as React from "react"
import { MinusIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"
import { mutate } from "swr"

import type { CartInputs } from "@/types"
import { addToCart, deleteCart, useCartList } from "@/lib/fetchers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface UpdateCartProps {
  cartLineItem: CartInputs
}

export function UpdateCart({ cartLineItem }: UpdateCartProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const { cartMutate } = useCartList()

  const [quantity, setQuantity] = React.useState(cartLineItem.quantity)

  const addToCartt = async (data: CartInputs) => {
    setIsLoading(true)

    const { success, message } = await addToCart(data)
    success ? toast.success(message) : toast.error(message)
    mutate(data)
    setIsLoading(false)
  }

  const product_ids = cartLineItem.product_id as unknown as number[]

  return (
    <div className="flex w-full items-center justify-between space-x-2 xs:w-auto xs:justify-normal">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-r-none"
          onClick={() => {
            const newQuantity = quantity > 1 ? quantity - 1 : 1
            setQuantity(newQuantity)
            addToCartt({
              product_id: cartLineItem.product_id,
              quantity: newQuantity,
            })
          }}
          disabled={isLoading}
        >
          <MinusIcon className="size-3" aria-hidden="true" />
          <span className="sr-only">Remove one item</span>
        </Button>
        <Input
          type="number"
          min="1"
          className="h-8 w-14 rounded-none border-x-0"
          value={quantity}
          onChange={(e) => {
            const newQuantity = Number(e.target.value)
            setQuantity(newQuantity)
            addToCartt({
              product_id: cartLineItem.product_id,
              quantity: newQuantity,
            })
          }}
        />
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-l-none"
          onClick={() => {
            const newQuantity = quantity + 1
            setQuantity(newQuantity)
            addToCartt({
              product_id: cartLineItem.product_id,
              quantity: newQuantity,
            })
          }}
        >
          <PlusIcon className="size-3" aria-hidden="true" />
          <span className="sr-only">Add one item</span>
        </Button>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="size-8 hover:bg-red-500 hover:text-white"
        onClick={() => {
          setIsLoading(true)
          const handleDeleteCartItem = async () => {
            const { success } = await deleteCart(product_ids)
            cartMutate()

            if (!success) throw new Error()
            setIsLoading(false)
          }

          toast.promise(handleDeleteCartItem(), {
            loading: "Deleting cart...",
            success: "Cart deleted successfully",
            error: "Failed to delete Cart",
          })
        }}
        disabled={isLoading}
      >
        <TrashIcon className="size-3" aria-hidden="true" />
        <span className="sr-only">Delete item</span>
      </Button>
    </div>
  )
}
