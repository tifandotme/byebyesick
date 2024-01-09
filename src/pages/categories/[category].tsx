import React, { useState, type ReactElement } from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useRouter } from "next/router"

import { SortByConfig, SortConfig } from "@/config"
import { useProductData } from "@/lib/fetchers"
import { unslugify } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MainLayout from "@/components/layout/main-layout"
import Loader from "@/components/loader"
import DropdownFilter from "@/features/products/components/filter-sorter"
import PaginationComponent from "@/features/products/components/pagination-product"
import { ProductCard } from "@/features/products/components/products-card"

export const categories = {
  "obat-bebas": 1,
  "obat-keras": 2,
  "obat-bebas-terbatas": 3,
  "non-obat": 4,
}
export const getServerSideProps: GetServerSideProps<{
  category: keyof typeof categories
}> = async (context) => {
  const category = context.params?.category as
    | keyof typeof categories
    | undefined

  if (!category) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      category,
    },
  }
}

export default function CategoriesPage({
  category,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const [sortBy, setSortBy] = useState("desc")
  const [sort, setSort] = useState("date")

  const [, setCurrentPage] = useState<number>(1)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)

  const { data, error, isLoading } = useProductData({
    drug_class: categories[category],
    search: debouncedSearch,
    sort_by: sortBy,
    sort: sort,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <p>Error {error.message}</p>
        {}
      </div>
    )
  }

  const categoryTitle =
    typeof router.query?.category === "string"
      ? unslugify(router.query.category)
      : ""

  return (
    <>
      <div>
        <h1 className="mt-9 text-2xl font-semibold capitalize">
          {categoryTitle}
        </h1>

        <div>
          {data?.data.current_page_total_items == 0 ? (
            <div className="flex items-center justify-center">
              No product yet
            </div>
          ) : (
            <>
              <div className="mt-5 flex w-full max-w-md items-center space-x-2">
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
              </div>
              <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data?.data.items.map((items) => (
                  <div key={items.id}>
                    <ProductCard
                      product={{
                        data: items,
                      }}
                    />
                  </div>
                ))}
              </div>
              <PaginationComponent
                page={data?.data.current_page!}
                setCurrentPage={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </>
  )
}

CategoriesPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
