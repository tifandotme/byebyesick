import React from "react"
import { useSession } from "next-auth/react"

import type { IProduct } from "@/types/api"
import { DrugClassConfig, SortByConfig, SortConfig } from "@/config"
import { useAddressById, useProductData } from "@/lib/fetchers"
import { useDebounce } from "@/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MainLayout from "@/components/layout/main-layout"
import DropdownFilter from "@/features/products/components/filter-sorter"
import PaginationComponent from "@/features/products/components/pagination-product"
import { ProductCard } from "@/features/products/components/products-card"

export const classif = {
  "obat-bebas": 1,
  "obat-keras": 2,
  "obat-bebas-terbatas": 3,
  "non-obat": 4,
} as const

export default function SeeAllAroundYourDistrict() {
  const { data: session } = useSession()
  const [sortBy, setSortBy] = React.useState("desc")
  const [sort, setSort] = React.useState("date")

  const [, setCurrentPage] = React.useState<number>(1)
  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search, 500)
  const [drugClass, setDrugClass] = React.useState<keyof typeof classif>()

  const { addressData } = useAddressById(session?.user?.user_id ?? 0)

  const { data, error, isLoading, mutate, resetFilters } = useProductData<
    IProduct[]
  >(
    {
      drug_class: drugClass,
      search: debouncedSearch,
      sort_by: sortBy,
      sort: sort,
    },
    `/v1/products?latitude=${addressData?.latitude}&longitude=${addressData?.longitude}`,
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
      <div className="mt-5 flex w-full max-w-6xl items-center space-x-2">
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
          title="Sort"
          buttonOpener="Sort"
        />
      </div>
      <div className="mb-3 mt-5 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.data.items.map((cat) => (
          <div key={cat.id}>
            <ProductCard product={cat} />
          </div>
        ))}
        <PaginationComponent
          page={data?.data.current_page!}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  )
}
SeeAllAroundYourDistrict.getLayout = function getLayout(
  page: React.ReactElement,
) {
  return <MainLayout>{page}</MainLayout>
}
