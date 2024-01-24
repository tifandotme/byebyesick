/* eslint-disable @next/next/no-img-element */

import React from "react"
import { useRouter } from "next/router"
import useSWR from "swr"

import type { IOrderResponse, ResponseGetAll } from "@/types/api"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { PageHeaderDescription } from "@/components/page-header"
import { OrderRequestsTable } from "@/features/pharmacies/components/tables/order-requests"

export default function OrderRequestsPage() {
  const router = useRouter()
  const { page, per_page, sort } = router.query

  const { data, isLoading, mutate } = useSWR<ResponseGetAll<IOrderResponse[]>>(
    () => {
      const params = new URLSearchParams()
      if (page) params.set("page", page)
      if (per_page) params.set("limit", per_page)
      if (sort) params.set("sort_by", sort.split(".")[0] as string)
      if (sort) params.set("sort", sort.split(".")[1] as string)

      return `/v1/orders/pharmacy-admin?${params.toString()}`
    },
  )

  return (
    <div className="space-y-6 overflow-auto">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <h3 className="mt-10 text-2xl font-bold leading-10 tracking-tight">
            Order Requests
          </h3>
        </div>
        <PageHeaderDescription size="sm">
          Manage my orders
        </PageHeaderDescription>
      </div>

      {isLoading && !data && (
        <DataTableSkeleton
          columnCount={6}
          filterableFieldCount={1}
          isSearchable={false}
        />
      )}
      {data && data.data.items.length > 0 ? (
        <OrderRequestsTable
          data={data.data.items}
          pageCount={data.data.total_pages}
          mutate={mutate}
        />
      ) : (
        <div>
          <img src="/images/empty-order" width="600px" height="600px" alt="" />
        </div>
      )}
    </div>
  )
}

OrderRequestsPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>
}
