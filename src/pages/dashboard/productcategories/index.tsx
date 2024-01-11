import React from "react"
import { useRouter } from "next/router"
import useSWR from "swr"

import type { IProduct, IProductCategory, ResponseGetAll } from "@/types/api"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { ProductCategoriesTable } from "@/features/admin/table/product-categories-table"
import ProductCategoriesLayout from "@/features/productcategories/components/layout"

interface ProductsFilter {
  drug_class?: number
  search?: string
  limit?: number
  sort?: string
  sort_by?: string
  page?: number
}

const useProductData = (filters: ProductsFilter) => {
  const { drug_class, search, limit, sort, sort_by, page } = filters

  let url = "/v1/product-categories?"
  if (search) url += `search=${search}&`
  if (limit) url += `limit=${limit}&`
  if (sort_by) url += `sort_by=${sort_by}&sort=${sort}&`
  if (drug_class) url += `drug_class=${drug_class}&`
  if (page) url += `page=${page}`

  const { data, isLoading, mutate, error } =
    useSWR<ResponseGetAll<IProductCategory[]>>(url)

  const resetFilters = () => {
    mutate()
  }

  return {
    data,
    error,
    isLoading,
    mutate,
    resetFilters,
  }
}
export default function ProductCategoriesTablePage() {
  const router = useRouter()

  // const { data, isLoading, mutate } = useProductData({})
  const { page, per_page, search, sort } = router.query

  const { data, isLoading, mutate } = useSWR<
    ResponseGetAll<IProductCategory[]>
  >(() => {
    const params = new URLSearchParams()
    if (per_page) params.set("limit", per_page)
    if (page) params.set("page", page)
    if (search) params.set("search", search)
    if (sort) params.set("sort_by", sort.split(".")[0] as string)
    if (sort) params.set("sort", sort.split(".")[1] as string)

    return `/v1/product-categories?${params.toString()}`
  })

  return (
    <>
      <div className="space-y-6 overflow-auto">
        {isLoading && <DataTableSkeleton columnCount={5} />}
        {data && (
          <ProductCategoriesTable
            data={data.data.items}
            mutate={mutate}
            pageCount={data?.data.total_pages}
          />
        )}
      </div>
    </>
  )
}

ProductCategoriesTablePage.getLayout = function getLayout(
  page: React.ReactElement,
) {
  return (
    <DashboardLayout>
      <ProductCategoriesLayout>{page}</ProductCategoriesLayout>
    </DashboardLayout>
  )
}
