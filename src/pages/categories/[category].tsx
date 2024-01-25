import React, { useState, type ReactElement } from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Image from "next/image"
import { useRouter } from "next/router"
import useSWR from "swr"

import type { Option } from "@/types"
import type { IProduct, ResponseGetAll } from "@/types/api"
import { categories, SortByConfig, SortConfig } from "@/config"
import { unslugify } from "@/lib/utils"
import ChartLoader from "@/components/chart/chartLoader"
import { imageLoader } from "@/components/image-loader"
import { MainLayout } from "@/components/layouts/main"
import DropdownFilter from "@/features/products/components/filter-sorter"
import PaginationComponent from "@/features/products/components/pagination-product"
// import PaginationComponent from "@/features/products/components/pagination-product"
import { ProductCard } from "@/features/products/components/products-card"
import Search from "@/features/sales-report/components/search/search"

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
  const [sortBy, setSortBy] = React.useState("name")
  const [sort, setSort] = React.useState("desc")
  const [search, setSearch] = React.useState<string>("")
  const [page, setCurrentPage] = useState<number>(1)
  const [drugClass] = React.useState(categories[category])

  const { data, isLoading, error } = useSWR<ResponseGetAll<IProduct[]>>(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (drugClass) params.set("drug_class", String(drugClass))
    if (sort) params.set("sort", sort)
    if (sortBy) params.set("sort_by", sortBy)
    if (page) params.set("page", page.toString())
    return `/v1/products?${params.toString()}`
  })

  const sortByMap = (id: string): Option => {
    const output = SortByConfig.find((status) => status.value === id)
    if (output) return output
    return {
      label: "",
      value: "",
    }
  }

  const sortMap = (id: string): Option => {
    const output = SortConfig.find((status) => status.value === id)
    if (output) return output
    return {
      label: "",
      value: "",
    }
  }

  const categoryTitle =
    typeof router.query?.category === "string"
      ? unslugify(router.query.category)
      : ""

  return (
    <>
      <div>
        <div className="w-full bg-primary">
          <div className="container flex max-w-6xl justify-between ">
            <div className="mb-9 mt-8 md:mt-auto ">
              <h2 className="text-3xl font-bold capitalize text-white md:text-5xl">
                {categoryTitle}
              </h2>
            </div>

            <div className="mt-auto hidden md:block">
              <Image
                loader={imageLoader}
                src={`${process.env.NEXT_PUBLIC_SITE_PATH}/images/around-me.svg`}
                alt=""
                width={300}
                height={300}
                className="hidden scale-100 object-fill md:block"
              />
              {/* <HeroSection /> */}
            </div>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-center">Something wrong, please try again.</p>
      )}

      {!error && (
        <>
          <div className="container mt-4 max-w-6xl">
            <Search setValue={setSearch} placeholder="Search Drugs..." />
          </div>

          <div className="container mr-auto mt-2 flex max-w-6xl space-x-2">
            <DropdownFilter
              filter={sort}
              setFilter={setSort}
              options={SortConfig}
              title="Sort By"
              buttonOpener={sort ? sortMap(String(sort)).label : "Sort"}
            />
            <DropdownFilter
              filter={sortBy}
              setFilter={setSortBy}
              title="Sort By"
              options={SortByConfig}
              buttonOpener={
                sortBy ? sortByMap(String(sortBy)).label : "Sort By"
              }
            />
          </div>

          <div className="container max-w-6xl">
            <div className="mb-3 mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <ChartLoader />
                </div>
              ) : (
                data &&
                data?.data.items.map((around) => (
                  <div key={around.id}>
                    <ProductCard product={around} />
                  </div>
                ))
              )}
            </div>

            {!isLoading && data && data.data.items.length === 0 && (
              <div className="flex py-9 ">
                <div className="flex w-full max-w-6xl flex-col items-center justify-center">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SITE_PATH}/images/empty-order.svg`}
                    className=""
                    width={600}
                    height={600}
                    alt=""
                  />
                  <div className="self-center text-center text-3xl font-bold">
                    No Product Found
                  </div>
                </div>
              </div>
            )}
            <div className="py-5">
              <PaginationComponent
                page={data?.data.current_page || 1}
                setCurrentPage={setCurrentPage}
              />
            </div>
          </div>
        </>
      )}
    </>
    // <div className="flex justify-center">
    //   <div className="max-w-6xl">
    //     <h1 className="text-2xl font-semibold capitalize mt-9">
    //       {categoryTitle}
    //     </h1>

    //     <div>
    //       {data?.data.current_page_total_items == 0 ? (
    //         <div className="flex items-center justify-center">
    //           No product yet
    //         </div>
    //       ) : (
    //         <>
    //           {!error && (
    //             <>
    //               <div className="container max-w-6xl">
    //                 <Search
    //                   setValue={setSearch}
    //                   placeholder="Search Drugs..."
    //                 />
    //               </div>

    //               <div className="container flex max-w-6xl mt-2 mr-auto space-x-2">
    //                 <DropdownFilter
    //                   filter={sortBy}
    //                   setFilter={setSortBy}
    //                   options={SortConfig}
    //                   title="Sort"
    //                   buttonOpener="Sort"
    //                 />
    //                 <DropdownFilter
    //                   filter={sort}
    //                   setFilter={setSort}
    //                   options={SortByConfig}
    //                   title="Sort By"
    //                   buttonOpener="Sort By"
    //                 />
    //               </div>

    //               <div className="container max-w-6xl">
    //                 <div className="grid grid-cols-2 gap-4 mt-5 mb-3 md:grid-cols-3 lg:grid-cols-5">
    //                   {data?.data.items.map((cat) => (
    //                     <div key={cat.id}>
    //                       <ProductCard product={cat} />
    //                     </div>
    //                   ))}
    //                 </div>
    //               </div>
    //             </>
    //           )}
    //         </>
    //       )}
    //     </div>
    //   </div>
    // </div>
  )
}

CategoriesPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
