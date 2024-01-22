/* eslint-disable @next/next/no-img-element */

import React from "react"
import { Loader2 } from "lucide-react"

import type { IProduct } from "@/types/api"
import { classif, DrugClassConfig, SortByConfig, SortConfig } from "@/config"
import { useAddressMain, useProductData } from "@/lib/fetchers"
import { useDebounce } from "@/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainLayout } from "@/components/layouts/main"
import DropdownFilter from "@/features/products/components/filter-sorter"
import { ProductCard } from "@/features/products/components/products-card"

export default function SeeAllAroundYourDistrict() {
  const { addressData, addressIsLoading } = useAddressMain()

  const [sortBy, setSortBy] = React.useState("desc")
  const [sort, setSort] = React.useState("date")
  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search, 500)
  const [drugClass, setDrugClass] = React.useState<keyof typeof classif>()

  let url = ""
  if (addressData?.data.latitude && addressData?.data.longitude) {
    url = `/v1/products?latitude=${addressData?.data.latitude}&longitude=${addressData?.data.longitude}&`
  }
  const { data, error, isLoading, resetFilters } = useProductData<IProduct[]>(
    {
      drug_class: drugClass,
      search: debouncedSearch,
      sort_by: sortBy,
      sort: sort,
    },
    url,
  )

  if (addressIsLoading)
    return (
      <div className="mt-8 flex items-center justify-center">
        <Loader2 className="animate-spin" /> searching products around you....
      </div>
    )

  if (!addressData?.data.latitude && !addressData?.data.longitude)
    return (
      <div className="mt-8 flex items-center justify-center ">
        <p className="text-center">
          Failed to get latitude and longitude, please refresh this page
        </p>
      </div>
    )

  if (isLoading)
    return (
      <div className="mt-8 flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    )

  const handleResetFilters = () => {
    resetFilters()
    setSearch("")
    setSortBy("")
    setSort("desc")
  }

  return (
    <>
      <div>
        <div className="w-full bg-[#f0fdf4]">
          <div className="container flex max-w-6xl justify-between ">
            <div className="mb-9 mt-8 md:mt-auto ">
              <h2 className="text-3xl font-semibold md:text-5xl">
                Around {addressData.data.sub_district}
              </h2>
              <p className="text-sm text-muted-foreground">
                Get drugs around {addressData.data.sub_district} location now
              </p>
            </div>

            <div className="mt-auto">
              <img
                src="/images/around-me.svg"
                alt=""
                width="300px"
                height="300px"
                className="hidden scale-125 object-fill md:block"
              />
            </div>
          </div>
        </div>
      </div>

      {data?.data.total_items === 0 && (
        <div>
          <p>There are no products around you</p>
        </div>
      )}

      {error && (
        <p className="text-center">Something wrong, please try again.</p>
      )}

      {!error && (
        <>
          <div className="container max-w-6xl">
            <Input
              type="text"
              placeholder="Search products here..."
              onChange={(e) => setSearch(e.target.value)}
              className="mt-4"
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
              buttonOpener=" Type"
            />

            <Button
              className="rounded-full border-dashed border-red-300 text-xs text-red-600 hover:border-none hover:bg-red-600 hover:text-white"
              variant={"outline"}
              size={"sm"}
              onClick={handleResetFilters}
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

SeeAllAroundYourDistrict.getLayout = function getLayout(
  page: React.ReactElement,
) {
  return <MainLayout>{page}</MainLayout>
}
