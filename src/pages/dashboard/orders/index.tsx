/* eslint-disable @next/next/no-img-element */

import React from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import useSWR from "swr"

import type { IOrderResponse, ResponseGetAll } from "@/types/api"
import { SUPER_ADMIN_ROLE } from "@/config"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import OrderLayout from "@/features/order/layout"
import { OrderRequestsTable } from "@/features/pharmacies/components/tables/order-requests"

export default function OrderRequestsPage() {
  const router = useRouter()
  const { page, per_page, sort, order_status_id } = router.query
  const { data: session } = useSession()

  const { data, isLoading, mutate } = useSWR<ResponseGetAll<IOrderResponse[]>>(
    () => {
      const params = new URLSearchParams()
      if (page) params.set("page", page)
      if (per_page) params.set("limit", per_page)
      if (sort) params.set("sort_by", sort.split(".")[0] as string)
      if (sort) params.set("sort", sort.split(".")[1] as string)
      if (order_status_id) params.set("order_status_id", order_status_id)
      if (session?.user.user_role_id === SUPER_ADMIN_ROLE)
        return `/v1/orders/admin?${params.toString()}`
      else return `/v1/orders/pharmacy-admin?${params.toString()}`
    },
  )

  return (
    <div className="space-y-6 overflow-auto">
      {isLoading && !data && (
        <DataTableSkeleton
          columnCount={6}
          filterableFieldCount={1}
          isSearchable={false}
        />
      )}
      {data ? (
        <OrderRequestsTable
          data={data.data.items}
          pageCount={data.data.total_pages}
          mutate={mutate}
        />
      ) : (
        <div className="flex py-9">
          <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-3">
            <img
              src={`${process.env.NEXT_PUBLIC_SITE_PATH}/images/empty-order.svg`}
              className=""
              width="600px"
              height="600px"
              alt=""
            />
            <div className="self-center text-3xl font-bold ">
              No Order Found
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

OrderRequestsPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <OrderLayout>{page}</OrderLayout>
    </DashboardLayout>
  )
}
