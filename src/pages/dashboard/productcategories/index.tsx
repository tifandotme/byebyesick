import React from "react"
import { useRouter } from "next/router"
import useSWR from "swr"

import type { ApiResponse, IProductCategory } from "@/types/api"
import { Button } from "@/components/ui/button"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { ProductCategoriesTable } from "@/features/admin/table/product-categories-table"
import ProductCategoriesLayout from "@/features/productcategories/components/layout"

export const useProductData = () => {
  const { data, isLoading, mutate, error } = useSWR<
    ApiResponse<IProductCategory[]>
  >(`/v1/product-categories`)

  return {
    data,
    isLoading,
    mutate,
    error,
  }
}

export default function ProductCategoriesTablePage() {
  const router = useRouter()

  const { data, isLoading, mutate, error } = useProductData()

  return (
    <>
      <div className="space-y-6 overflow-auto">
        {isLoading && <DataTableSkeleton columnCount={5} />}
        {error && (
          <div className="grid h-screen place-content-center px-4">
            <div className="text-center">
              <h1 className="text-9xl font-black text-gray-200">500</h1>

              <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Uh-oh!
              </p>

              <p className="mt-4 text-gray-500">
                We have a server problem, please try again later.
              </p>

              <Button className="mt-6" onClick={() => router.reload()}>
                Refresh
              </Button>
            </div>
          </div>
        )}
        {!isLoading && data && (
          <ProductCategoriesTable data={data?.data.items} mutate={mutate} />
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
