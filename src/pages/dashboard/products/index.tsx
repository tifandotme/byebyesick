import React from "react"
import { ProductTable } from "@/features/admin/table/product-table"
import ProductLayout from "@/features/products/components/layout"
import useSWR from "swr"

import type { Product } from "@/types/fakedata"
import { fetcher } from "@/lib/fetchers"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"

export const useFakeData = () => {
  const { data, isLoading } = useSWR<Product>(
    `https://dummyjson.com/products`,
    fetcher,
  )

  return {
    data,
    isLoading,
  }
}

export default function ProductTablePage() {
  const { data, isLoading } = useFakeData()

  return (
    <>
      <div className="space-y-6 overflow-auto">
        {isLoading && <DataTableSkeleton columnCount={5} />}
        {!isLoading && data?.products && <ProductTable data={data.products} />}
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
