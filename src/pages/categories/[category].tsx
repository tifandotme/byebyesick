import React, { useState, type ReactElement } from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useRouter } from "next/router"

import type { IProduct } from "@/types/api"
import { categories, SortByConfig, SortConfig } from "@/config"
import { useProductData } from "@/lib/fetchers"
import { unslugify } from "@/lib/utils"
import { useDebounce } from "@/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MainLayout } from "@/components/layouts/main"
import Loader from "@/components/loader"
import DropdownFilter from "@/features/products/components/filter-sorter"
// import PaginationComponent from "@/features/products/components/pagination-product"
import { ProductCard } from "@/features/products/components/products-card"

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

  // const [, setCurrentPage] = useState<number>(1)
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)

  const { data, error, isLoading, resetFilters } = useProductData<IProduct[]>(
    {
      drug_class: categories[category],
      search: debouncedSearch,
      sort_by: sortBy,
      sort: sort,
    },
    "/v1/products?",
  )

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
      </div>
    )
  }

  const categoryTitle =
    typeof router.query?.category === "string"
      ? unslugify(router.query.category)
      : ""

  const handleResetFilters = () => {
    resetFilters()
    setSearch("")
    setSortBy("")
    setSort("desc")
  }

  return (
    <div className="flex justify-center">
      <div className="max-w-6xl">
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
          )}
        </div>
      </div>
    </div>
  )
}

CategoriesPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
