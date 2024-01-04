import React from "react"
import Image from "next/image"
import CollapsableBlock from "@/features/drug/component/collapsableBlock/collapsableBlock"
import InfoBlock from "@/features/drug/component/infoBlock/infoBlock"
import { MapPin, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"

function DetailProduct() {
  return (
    <div className="flex flex-col gap-16 md:flex-row">
      <div className="flex max-h-[336px] flex-auto justify-center md:w-1/2">
        <Image width={362} height={336} src={"/Enervon.jpg"} alt="Enervon C" />
      </div>
      <div className="flex flex-auto flex-col gap-3 md:w-1/2">
        <div className="flex">
          <div className="flex w-full justify-between">
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-semibold">Enervon C</h1>
              <h2 className="text-xl font-medium text-muted-foreground">
                Rp. 50.000/<span>Strips</span>
              </h2>
              <h3 className="text-sm font-normal text-muted-foreground">
                Vitamin C
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
          <InfoBlock title="Classification">Test</InfoBlock>
          <InfoBlock title="Category">Test</InfoBlock>
          <InfoBlock title="Manufacturer">
            <div className="font-semibold">PT. Suka Duka</div>
          </InfoBlock>
        </div>
        <CollapsableBlock
          label="Description"
          value={
            "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente, consequatur reiciendis. Odit consequuntur asperiores veritatis ducimus minus! Similique, temporibus! Voluptate soluta error fugit eius voluptatem ab natus atque porro consequatur"
          }
        />
      </div>
    </div>
  )
}

export default DetailProduct