import React from "react"
import { useRouter } from "next/router"
import { ProductTable } from "@/features/admin/table/product-table"
import ProductLayout from "@/features/products/components/layout"
import { Divide } from "lucide-react"
import useSWR from "swr"

import type { ApiResponse, IProduct } from "@/types/api"
import { Button } from "@/components/ui/button"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"

export const useProductData = () => {
  const { data, isLoading, mutate, error } =
    useSWR<ApiResponse<IProduct[]>>(`/v1/products`)

  return {
    data,
    isLoading,
    mutate,
    error,
  }
}

export default function ProductTablePage() {
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
