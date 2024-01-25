import React from "react"
import Image from "next/image"
import useSWR from "swr"

import type { Option } from "@/types"
import type { IProduct, ResponseGetAll } from "@/types/api"
import { DrugClassConfig, SortByConfig, SortConfig } from "@/config"
import useGeolocation from "@/hooks/use-geolocation"
import ChartLoader from "@/components/chart/chartLoader"
import { MainLayout } from "@/components/layouts/main"
import DropdownFilter from "@/features/products/components/filter-sorter"
import PaginationComponent from "@/features/products/components/pagination-product"
import { ProductCard } from "@/features/products/components/products-card"
import Search from "@/features/sales-report/components/search/search"

export default function SeeAllAroundYou() {
  const { location, locationError } = useGeolocation()

  const [sortBy, setSortBy] = React.useState("name")
  const [sort, setSort] = React.useState("desc")
  const [search, setSearch] = React.useState<string>("")
  const [page, setPage] = React.useState<number>(1)
  const [drugClass, setDrugClass] = React.useState<number>()

  const { data, isLoading, error } = useSWR<ResponseGetAll<IProduct[]>>(() => {
    if (!location.latitude || !location.longitude) return null

    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (drugClass) params.set("drug_class", String(drugClass))
    if (sort) params.set("sort", sort)

    if (sortBy) params.set("sort_by", sortBy)
    if (page) params.set("page", page.toString())
    return `/v1/products?${params.toString()}&latitude=${location.latitude}&longitude=${location.longitude}`
  })

  const drugsMap = (id: string): Option => {
    const output = DrugClassConfig.find((status) => status.value === id)
    if (output) return output
    return {
      label: "",
      value: "",
    }
  }

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

  return (
    <>
      <div className="w-full bg-primary">
        <div className="container flex max-w-6xl justify-between ">
          <div className="mb-9 mt-8 md:mt-auto ">
            <h2 className="text-3xl font-bold text-white md:text-5xl">
              Around You
            </h2>
            <p className="text-sm text-white">
              Get drugs around your location now
            </p>
          </div>

          <div className="mt-auto hidden md:block">
            <Image
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

      {error && (
        <div>
          <p>{error}, An error occured please try again</p>
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
          <p className="py-8 text-center">
            Please allow location permission to see products
          </p>
        </div>
      )}

      {!error && !locationError && (
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
            <DropdownFilter
              filter={String(drugClass) ?? ""}
              setFilter={setDrugClass}
              options={DrugClassConfig}
              title=" Type"
              buttonOpener={
                drugClass ? drugsMap(String(drugClass)).label : "Type"
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
                setCurrentPage={setPage}
              />
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
