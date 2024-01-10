import React from "react"
import Image from "next/image"
import { LoaderIcon } from "lucide-react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import MainLayout from "@/components/layout/mainLayout"
import CollapsableBlock from "@/features/drug/component/collapsableBlock/collapsableBlock"
import InfoBlock from "@/features/drug/component/infoBlock/infoBlock"

function DoctorDetail() {
  const [isLoading, setIsLoading] = React.useState(false)

  return (
    <div className="flex flex-col gap-16 md:flex-row">
      <div className="relative h-60 flex-auto">
        <AspectRatio ratio={1} className="mx-auto h-60 w-60">
          <Image
            src={"/Enervon.jpg"}
            loading="lazy"
            className="rounded-full border object-cover"
            alt={"Test"}
            fill
          />
        </AspectRatio>
        {/* 
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
                    <>Loading</>
                    <PlaceholderImage className="rounded-none" asChild />
                )} */}
      </div>

      <div className="flex flex-auto flex-col gap-3 md:w-1/2">
        <div className="flex">
          <div className="flex w-full justify-between">
            <div className="flex flex-col gap-3">
              <h1 className="text-xl font-semibold lg:text-3xl">
                Dokter Wasik S.Pd.
              </h1>
            </div>
            <div>
              <Button
                aria-label="Add to cart"
                size="sm"
                className="h-8 w-full rounded-sm"
                disabled={isLoading}
              >
                {isLoading && <LoaderIcon className="" />}
                Chat Doctor
              </Button>
            </div>
          </div>
        </div>
        <hr className="w-full border-primary" />
        <div className="flex w-full gap-10">
          <InfoBlock title="Specialization">Hati</InfoBlock>
          <InfoBlock title="Year Of Experience">2 Years</InfoBlock>
        </div>
        <CollapsableBlock
          label="Profile"
          value={
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem deserunt libero molestias repellendus dolores porro perferendis expedita quae adipisci voluptate sequi praesentium ipsa dolor recusandae consectetur ipsum debitis nemo assumenda reprehenderit, vel modi placeat natus. Culpa aliquid, architecto sapiente fugit, sequi suscipit beatae praesentium, possimus nesciunt magnam quos omnis corrupti tempora voluptatem."
          }
        />
      </div>
    </div>
  )
}
DoctorDetail.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
export default DoctorDetail
