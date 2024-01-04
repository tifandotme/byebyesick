import React from "react"
import Image from "next/image"
import { PlusIcon } from "lucide-react"

import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function ProductCard(props: {
  name: string
  image: string
  price: string
  selling_unit: string
  id: number
}) {
  return (
    <div className="flex flex-col rounded-md border p-3 shadow-md">
      <Image
        width={200}
        height={100}
        src={"/Enervon.jpg"}
        alt="Enervon C"
        className="w-full object-cover"
      />
      <div className="flex w-full flex-col gap-2 p-3">
        <h2 className="text-base font-medium">{props.name}</h2>
        <h3 className="text-xs font-medium text-muted-foreground">
          {formatPrice(props.price)}/<span>{props.selling_unit}</span>
        </h3>
        <Button size={"sm"} className="flex items-center gap-2 text-xs">
          <span>
            <PlusIcon className="h-3 w-3" />
          </span>
          Add To Cart
        </Button>
      </div>
    </div>
  )
}

export default ProductCard
