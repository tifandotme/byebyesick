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
    <div className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-6 md:grid-cols-2 lg:gap-12">
      <div className="grid items-start gap-3 md:grid-cols-5">
        <div className="md:col-span-4">
          {data.image?.length ? (
            <Image
              src={data.image}
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
      </div>
      <div className="grid items-start gap-4 md:gap-10">
        <div className="hidden items-start md:flex">
          <div className="grid gap-4">
            <h1 className="text-truncate text-3xl font-bold lg:text-4xl">
              {data.name}
            </h1>
            <p>{data.generic_name}</p>
            <div className="flex items-center gap-4 font-semibold">
              {formatPrice(data.minimum_price)} -{" "}
              {formatPrice(data.maximum_price)}
            </div>

            <p>Per {data.selling_unit}</p>
          </div>
        </div>
        <form className="grid gap-4 md:gap-10">
          <div className="grid gap-2"></div>
          <Button
            size="lg"
            onClick={() => addToCartt({ product_id: data.id, quantity: 1 })}
            disabled={isLoading}
          >
            Buy Now
            {isLoading && <LoaderIcon className="" />}
          </Button>
        </form>
        <div className="grid gap-4 md:gap-10">
          <h2 className="text-2xl font-bold">Description</h2>
          <p>{data.description}</p>
        </div>
        <div className="grid gap-4 md:gap-10">
          <h2 className="text-2xl font-bold">Composition</h2>
          <p>{data.content}</p>
        </div>
        <div className="grid gap-4 md:gap-10">
          <h2 className="text-2xl font-bold">Packaging</h2>
          <div className="flex">
            <p>{data.drug_form}</p>
            <p>{data.unit_in_pack}</p>
          </div>
        </div>
        <div className="grid gap-4 md:gap-10">
          <h2 className="text-2xl font-bold">Information</h2>
          <div className="flex w-full gap-10">
            <InfoBlock title="Classification">
              {drugClassificationName}
            </InfoBlock>
            <InfoBlock title="Category">{productCategoryName} </InfoBlock>
            <InfoBlock title="Manufacturer">{manufacturerName}</InfoBlock>
          </div>
        </div>

        <div className="grid gap-4 md:gap-10">
          <h2 className="text-2xl font-bold">Details</h2>
          <div className="flex w-full gap-10">
            <InfoBlock title="Weight">{data.weight}</InfoBlock>
            <InfoBlock title="Width">{data.width} </InfoBlock>
            <InfoBlock title="Length">{data.length}</InfoBlock>
            <InfoBlock title="Height">{data.height}</InfoBlock>
          </div>
        </div>
        <div className="grid gap-4 md:gap-10">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <p>Common questions and answers about the drug goes here.</p>
        </div>
      </div>
    </div>
  )
}

export default DetailProduct
