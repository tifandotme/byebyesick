import React from "react"
import Image from "next/image"

import type { IProduct } from "@/types/api"
import { classif, DrugClassConfig, SortByConfig, SortConfig } from "@/config"
import { useProductData } from "@/lib/fetchers"
import { useDebounce } from "@/hooks/use-debounce"
import useGeolocation from "@/hooks/use-geolocation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainLayout } from "@/components/layouts/main"
import DropdownFilter from "@/features/products/components/filter-sorter"
import { ProductCard } from "@/features/products/components/products-card"

export default function SeeAllAroundYou() {
  const { location, locationError } = useGeolocation()
  const [sortBy, setSortBy] = React.useState("desc")
  const [sort, setSort] = React.useState("date")
  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search, 500)
  const [drugClass, setDrugClass] = React.useState<keyof typeof classif>()

  const { data, error, isLoading, resetFilters } = useProductData<IProduct[]>(
    {
      drug_class: drugClass,
      search: debouncedSearch,
      sort_by: sortBy,
      sort: sort,
    },
    `/v1/products?latitude=${location.latitude}&longitude=${location.longitude}&`,
  )

  const handleResetFilter = () => {
    resetFilters()
    setSearch("")
    setSort("date")
    setDrugClass(undefined)
    setSortBy("desc")
  }

  if (isLoading) return <div>Loading...</div>

  return (
    <>
      <div className="w-full bg-[#f0fdf4]">
        <div className="container flex max-w-6xl justify-between ">
          <div className="mb-9 mt-8 md:mt-auto ">
            <h2 className="text-3xl font-semibold md:text-5xl">Around You</h2>
            <p className="text-sm text-muted-foreground">
              Get drugs around your location now
            </p>
          </div>

          <div className="mt-auto">
            <Image
              src={`${process.env.NEXT_PUBLIC_SITE_PATH}/images/around-me.svg`}
              alt=""
              width={300}
              height={300}
              className="hidden scale-125 object-fill md:block"
            />
          </div>
        </div>
      </div>

      {data?.data.total_items === 0 && (
        <div>
          <p>There are no products around you</p>
        </div>
      )}
      {error && (
        <div>
          <p>An error occured please try again</p>
        </div>
      )}

      {locationError && (
        <div className="flex flex-col items-center justify-center">
          <Image
            src={`${process.env.NEXT_PUBLIC_SITE_PATH}/images/no-location.svg`}
            className=""
            width={450}
            height={450}
            alt=""
          />
          <p className="text-center ">
            {locationError}, please allow location permission to see products
          </p>
        </div>
      )}

      {!error && !locationError && (
        <>
          <div className="container max-w-6xl">
            <Input
              type="text"
              placeholder="Search products here..."
              onChange={(e) => setSearch(e.target.value)}
              className="mt-4 "
            />
          </div>

          <div className="container mr-auto mt-2 flex max-w-6xl space-x-2">
            <DropdownFilter
              filter={sortBy}
              setFilter={setSortBy}
              options={SortConfig}
              title="Sort"
              buttonOpener="Sort"
            />
            <DropdownFilter
              filter={sort}
              setFilter={setSort}
              options={SortByConfig}
              title="Sort By"
              buttonOpener="Sort By"
            />

            <DropdownFilter
              filter={drugClass!}
              setFilter={setDrugClass}
              options={DrugClassConfig}
              title=" Type"
              buttonOpener="  Type"
            />

            <Button
              className="rounded-full border-dashed border-red-300 text-xs text-red-600 hover:border-none hover:bg-red-600 hover:text-white"
              variant={"outline"}
              size={"sm"}
              onClick={handleResetFilter}
            >
              Reset Filter
            </Button>
          </div>

          <div className="container max-w-6xl">
            <div className="mb-3 mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {data?.data.items.map((cat) => (
                <div key={cat.id}>
                  <ProductCard product={cat} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}
SeeAllAroundYou.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
