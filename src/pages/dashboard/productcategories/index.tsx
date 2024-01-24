import React from "react"
import { useRouter } from "next/router"
import useSWR from "swr"

import type { IProductCategory, ResponseGetAll } from "@/types/api"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { ProductCategoriesTable } from "@/features/admin/table/product-categories-table"
import ProductCategoriesLayout from "@/features/productcategories/components/layout"

export default function ProductCategoriesTablePage() {
  const router = useRouter()

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
        {isLoading && !data && (
          <DataTableSkeleton columnCount={5} filterableFieldCount={0} />
        )}{" "}
        {data && (
          <ProductCategoriesTable
            data={data.data.items}
            mutate={mutate}
            pageCount={data?.data.total_pages}
            current_page={parseInt(page as string) ?? 1}
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
