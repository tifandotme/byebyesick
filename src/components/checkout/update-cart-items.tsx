import * as React from "react"
import { MinusIcon, PlusIcon, TrashIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"

import type { CartInputs } from "@/types"
import { deleteCart, token } from "@/lib/fetchers"
import { catchError } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCartList } from "@/components/checkout/cart-sheet"

interface UpdateCartProps {
  cartLineItem: CartInputs
}

export function UpdateCart({ cartLineItem }: UpdateCartProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const { cartMutate } = useCartList(token)

  const [quantity, setQuantity] = React.useState(cartLineItem.quantity)

  const handleDecrement = () => {
    setQuantity((prevQuantity) => (prevQuantity > 0 ? prevQuantity - 1 : 0))
  }

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1)
  }

  const product_ids = cartLineItem.product_id as unknown as number[]

  return (
    <div className="flex w-full items-center justify-between space-x-2 xs:w-auto xs:justify-normal">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-r-none"
          onClick={handleDecrement}
          disabled={isLoading}
        >
          <MinusIcon className="h-3 w-3" aria-hidden="true" />
          <span className="sr-only">Remove one item</span>
        </Button>
        <Input
          type="number"
          min="0"
          className="h-8 w-14 rounded-none border-x-0"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 rounded-l-none"
          onClick={handleIncrement}
        >
          <PlusIcon className="h-3 w-3" aria-hidden="true" />
          <span className="sr-only">Add one item</span>
        </Button>
      </div>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => {
          setIsLoading(true)
          const handleDeleteCartItem = async () => {
            const { success } = await deleteCart(product_ids)
            cartMutate()

            if (!success) catchError
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
        <TrashIcon className="h-3 w-3" aria-hidden="true" />
        <span className="sr-only">Delete item</span>
      </Button>
    </div>
  )
}
