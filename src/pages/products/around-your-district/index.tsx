import React from "react"
import { useRouter } from "next/router"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import useSWR from "swr"

import type { IProduct, ResponseGetAll } from "@/types/api"
import { classif, DrugClassConfig, SortByConfig, SortConfig } from "@/config"
import { useAddressMain, useProductData } from "@/lib/fetchers"
import { useDebounce } from "@/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MainLayout from "@/components/layout/main-layout"
import DropdownFilter from "@/features/products/components/filter-sorter"
import PaginationComponent from "@/features/products/components/pagination-product"
import { ProductCard } from "@/features/products/components/products-card"

export default function SeeAllAroundYourDistrict() {
  const { addressData, addressIsLoading } = useAddressMain()

  // const [sortBy, setSortBy] = React.useState("desc")
  // const [sort, setSort] = React.useState("date")
  const [, setCurrentPage] = React.useState<number>(1)
  // const [search, setSearch] = React.useState("")
  // const debouncedSearch = useDebounce(search, 500)
  // const [drugClass, setDrugClass] = React.useState<keyof typeof classif>()
  const router = useRouter()

  const { search, sort, limit, page, latitude, longitude } = router.query

  console.log(addressData, "address")

  const { data, isLoading, error } = useSWR<ResponseGetAll<IProduct[]>>(() => {
    if (!addressData) return null
    const params = new URLSearchParams()

    if (search) params.set("search", search)
    if (sort) params.set("sort_by", sort.split(".")[0] as string)
    if (sort) params.set("sort", sort.split(".")[1] as string)
    if (page) params.set("page", page)
    if (limit) params.set("limit", limit)
    if (latitude) params.set("latitude", addressData.data.latitude)
    if (longitude) params.set("longitude", addressData.data.longitude)

    return `/v1/products?${params.toString()}`
  })

  console.log(latitude, "latitude")

  if (addressIsLoading)
    return (
      <div className="mt-8 flex items-center justify-center">
        <Loader2 className="animate-spin" />
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

  return (
    <>
      <div className="mt-5 flex justify-between text-2xl font-semibold">
        <h2>Around Your Home</h2>
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
          {/* <div className="items-center w-full mt-5 space-x-2 space-y-2 md:flex md:max-w-6xl md:space-x-2">
            <Input
              type="text"
              placeholder="Search products here..."
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button>Search</Button>
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
              title="Drug Classification"
              buttonOpener="Drug Classification"
            />
            <Button onClick={() => resetFilters()}>Reset Filter</Button>
          </div> */}

          <div className="mb-3 mt-5 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data?.data.items.map((cat) => (
              <div key={cat.id}>
                <ProductCard product={cat} />
              </div>
            ))}
          </div>
          <PaginationComponent
            page={data?.data.current_page!}
            setCurrentPage={setCurrentPage}
          />
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
