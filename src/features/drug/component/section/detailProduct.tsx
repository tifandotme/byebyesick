import React from "react"
import Image from "next/image"
import { MapPin, PlusIcon } from "lucide-react"

import type { IProduct } from "@/types/api"
import {
  getDrugClassificationName,
  getManufacturerName,
  getProductCategoryName,
} from "@/lib/fetchers"
import { Button } from "@/components/ui/button"
import { PlaceholderImage } from "@/components/image-placeholer"
import CollapsableBlock from "@/features/drug/component/collapsableBlock/collapsableBlock"
import InfoBlock from "@/features/drug/component/infoBlock/infoBlock"

function DetailProduct(data: IProduct) {
  const [drugClassificationName, setDrugClassificationName] = React.useState("")
  const [productCategoryName, setProductCategoryName] = React.useState("")
  const [manufacturerName, setManufacturerName] = React.useState("")

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

  return (
    <div className="flex flex-col gap-16 md:flex-row">
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
                Rp. 50.000/<span>{data.selling_unit}</span>
              </h2>
              <h3 className="text-sm font-normal text-muted-foreground">
                {data.generic_name}
              </h3>
              <h4 className="flex gap-2 text-sm">
                <span className="flex items-center justify-center">
                  <MapPin className="h-4 w-4" />
                </span>
                {data.content}
              </h4>
            </div>
            <div>
              <Button
                className="flex items-center gap-2"
                onClick={() => {
                  // startAddingToCart(async () => {
                  //   try {
                  //     await addToCart({
                  //       productId: product.data.id,
                  //       quantity: 1,
                  //     })
                  //     toast.success("Added to cart.")
                  //   } catch (err) {
                  //     catchError(err)
                  //   }
                  // })
                }}
              >
                <span>
                  <PlusIcon />
                </span>
                Add To Cart
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
