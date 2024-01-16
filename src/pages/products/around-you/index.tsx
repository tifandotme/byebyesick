import React from "react"

import type { IProduct } from "@/types/api"
import { classif, DrugClassConfig, SortByConfig, SortConfig } from "@/config"
import { useProductData } from "@/lib/fetchers"
import { useDebounce } from "@/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MainLayout from "@/components/layout/main-layout"
import DropdownFilter from "@/features/products/components/filter-sorter"
import PaginationComponent from "@/features/products/components/pagination-product"
import { ProductCard } from "@/features/products/components/products-card"

export default function SeeAllAroundYou() {
  const [latitude, setLatitude] = React.useState<number | null>(null)
  const [longitude, setLongitude] = React.useState<number | null>(null)
  const [locationError, setLocationError] = React.useState<string | null>(null)
  const [sortBy, setSortBy] = React.useState("desc")
  const [sort, setSort] = React.useState("date")

  const [, setCurrentPage] = React.useState<number>(1)
  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search, 500)
  const [drugClass, setDrugClass] = React.useState<keyof typeof classif>()

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
          setLocationError(null)
        },
        (err) => {
          setLocationError(err.message)
        },
      )
    } else {
      setLocationError("Geolocation is not supported by this browser.")
    }
  }, [latitude, longitude])

  const { data, error, isLoading, resetFilters } = useProductData<IProduct[]>(
    {
      drug_class: drugClass,
      search: debouncedSearch,
      sort_by: sortBy,
      sort: sort,
    },
    `/v1/products?latitude=${latitude}&longitude=${longitude}`,
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
      <div className="mt-5 flex justify-between text-2xl font-semibold">
        <h2>Around You</h2>
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
        <div>
          <p>{locationError}</p>
        </div>
      )}

      {!error && (
        <>
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
              title="Drug Classification"
              buttonOpener="Drug Classification"
            />
            <Button onClick={handleResetFilter}>Reset Filter</Button>
          </div>

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
      {/* <div className="flex items-center w-full max-w-6xl mt-5 space-x-2">
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
        <Button onClick={handleResetFilter}>Reset Filter</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-5 mb-3 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.data.items.map((cat) => (
          <div key={cat.id}>
            <ProductCard product={cat} />
          </div>
        ))}
      </div>
      <PaginationComponent
        page={data?.data.current_page!}
        setCurrentPage={setCurrentPage}
      /> */}
    </>
  )
}
SeeAllAroundYou.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
