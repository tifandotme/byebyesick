import React from "react"
import { ProductCategoriesTable } from "@/features/admin/table/product-categories-table"
import ProductCategoriesLayout from "@/features/productcategories/components/layout"
import useSWR from "swr"

import type { ProductCategoriesResponse } from "@/types/api"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"

export const useProductData = () => {
  const { data, isLoading, mutate } = useSWR<ProductCategoriesResponse>(
    `/products-categories/no-pagination`,
  )

  return {
    data,
    isLoading,
    mutate,
  }
}

export default function ProductCategoriesTablePage() {
  const { data, isLoading, mutate } = useProductData()

  return (
    <>
      <div className="space-y-6 overflow-auto">
        {isLoading && <DataTableSkeleton columnCount={5} />}
        {!isLoading && data && (
          <ProductCategoriesTable data={data} mutate={mutate} />
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
