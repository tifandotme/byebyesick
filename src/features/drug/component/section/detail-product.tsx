import React from "react"
import Image from "next/image"
import { LoaderIcon, MapPin } from "lucide-react"
import { toast } from "sonner"

import type { CartInputs } from "@/types"
import type { IProduct } from "@/types/api"
import {
  addToCart,
  getDrugClassificationName,
  getManufacturerName,
  getProductCategoryName,
} from "@/lib/fetchers"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { PlaceholderImage } from "@/components/image-placeholer"
import CollapsableBlock from "@/features/drug/component/collapsableBlock/collapsableBlock"
import InfoBlock from "@/features/drug/component/infoBlock/infoBlock"

function DetailProduct(data: IProduct) {
  const [drugClassificationName, setDrugClassificationName] = React.useState("")
  const [productCategoryName, setProductCategoryName] = React.useState("")
  const [manufacturerName, setManufacturerName] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    getDrugClassificationName(data.drug_classification_id).then(
      setDrugClassificationName,
    )
    getProductCategoryName(data.product_category_id).then(
      setProductCategoryName,
    )
    getManufacturerName(data.manufacturer_id).then(setManufacturerName)
  }, [
    data.drug_classification_id,
    data.product_category_id,
    data.manufacturer_id,
  ])
  const addToCartt = async (data: CartInputs) => {
    setIsLoading(true)

    const { success, message } = await addToCart(data)

    success ? toast.success(message) : toast.error(message)

    setIsLoading(false)
  }

  return (
    <div className="mt-8 flex flex-col gap-16 md:flex-row">
      <div className="flex max-h-[336px] flex-auto justify-center md:w-1/2">
        {data.image?.length ? (
          <Image
            src={data.image ?? "/images/placeholder.webp"}
            loading="lazy"
            className="object-cover"
            alt={data.image ?? data.name}
            width={600}
            height={600}
          />
        ) : (
          <PlaceholderImage className="rounded-none" asChild />
        )}
      </div>
      <div className="flex flex-auto flex-col gap-3 md:w-1/2">
        <div className="flex">
          <div className="flex w-full justify-between">
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-semibold">{data.name}</h1>
              <h2 className="text-xl font-medium text-muted-foreground">
                {formatPrice(data.minimum_price)} -{" "}
                {formatPrice(data.maximum_price)}/
                <span>{data.selling_unit}</span>
              </h2>
              <h3 className="text-sm font-normal text-muted-foreground">
                {data.generic_name}
              </h3>
              <h4 className="flex gap-2 text-sm">
                <span className="flex items-center justify-center truncate">
                  {data.unit_in_pack}/{data.drug_form}
                </span>
              </h4>
            </div>
            <div>
              <Button
                aria-label="Add to cart"
                size="sm"
                className="h-8 w-full rounded-sm"
                onClick={() => addToCartt({ product_id: data.id, quantity: 1 })}
                disabled={isLoading}
              >
                {isLoading && <LoaderIcon className="" />}
                Add to cart
              </Button>
            </div>
          </div>
        </div>
        <hr className="w-full border-primary" />
        <div className="flex w-full gap-10">
          <InfoBlock title="Classification">{drugClassificationName}</InfoBlock>
          <InfoBlock title="Category">{productCategoryName} </InfoBlock>
          <InfoBlock title="Manufacturer">
            <div className="font-semibold">{manufacturerName}</div>
          </InfoBlock>
        </div>
        <CollapsableBlock label="Description" value={data.description} />
      </div>
    </div>
  )
}

export default DetailProduct
