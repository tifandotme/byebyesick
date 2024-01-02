import React from "react"
import { ProductTable } from "@/features/admin/table/product-table"
import ProductLayout from "@/features/products/components/layout"
import useSWR from "swr"

import type { ApiResponse, IProduct } from "@/types/api"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"

export const useProductData = () => {
  const { data, isLoading, mutate } =
    useSWR<ApiResponse<IProduct[]>>(`/v1/products`)

  return {
    data,
    isLoading,
    mutate,
  }
}

export default function ProductTablePage() {
  const { data, isLoading, mutate } = useProductData()

  return (
    <>
      <div className="space-y-6 overflow-auto">
        {isLoading && <DataTableSkeleton columnCount={5} />}
        {!isLoading && data && (
          <ProductTable data={data?.data.items} mutate={mutate} />
        )}
      </div>
    </>
  )
}

ProductTablePage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <ProductLayout>{page}</ProductLayout>
    </DashboardLayout>
  )
}
