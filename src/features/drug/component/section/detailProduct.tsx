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
import CollapsableBlock from "@/features/drug/component/collapsableBlock/collapsableBlock"
import InfoBlock from "@/features/drug/component/infoBlock/infoBlock"

function DetailProduct(data: IProduct) {
  const [drugClassificationName, setDrugClassificationName] =
    React.useState("Unknown")
  const [productCategoryName, setProductCategoryName] =
    React.useState("Unknown")
  const [manufacturerName, setManufacturerName] = React.useState("Unknown")

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
        <Image width={362} height={336} src={data.image} alt="Enervon C" />
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
                Send from Jln Sehati
              </h4>
            </div>
            <div>
              <Button className="flex items-center gap-2">
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
