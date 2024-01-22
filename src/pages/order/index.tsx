import React from "react"
import Link from "next/link"
import useSWR from "swr"

import type {
  OrderStatusI,
  OrderWithStatusI,
  ResponseGetAll,
} from "@/types/api"
import { formatDate, formatPrice } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MainLayout } from "@/components/layouts/main"

function OrderListPage() {
  const [search, setSearch] = React.useState<string>("")
  const [orderStatus, setOrderStatus] = React.useState<OrderStatusI>()
  const { data, isLoading } = useSWR<ResponseGetAll<OrderWithStatusI[]>>(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (orderStatus) params.set("order_status_id", orderStatus.id.toString())
    return `/v1/orders/user?${params.toString()}`
  })

  return (
    <div className="flex justify-center py-9">
      <div className="flex w-full max-w-6xl flex-col">
        <div className="mb-3 self-center text-3xl font-bold">Order List</div>
        <div className="grid grid-cols-1 gap-5">
          {isLoading ? (
            <div className="flex justify-center">loading</div>
          ) : (
            data &&
            data.data.items.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-semibold md:text-xl">
                        {order?.Pharmacy.name}
                      </h3>
                      <div className="text-base text-gray-500 dark:text-gray-400">
                        Transaction ID: {order.transaction_id}
                      </div>
                    </div>
                    <div className="flex items-center justify-center rounded-md border p-2 font-medium text-green-500">
                      {order.Status.name}
                    </div>
                  </div>
                  <Separator />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="text-lg font-medium">
                      Total Item: {order.no_of_items}
                    </div>
                  </div>
                  <div className="text-lg text-gray-500 dark:text-gray-400">
                    Order Date: {formatDate(order?.date)}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-2xl">
                      Total Payment:{" "}
                      <span className="font-bold">
                        {formatPrice(order.total_payment)}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/order/detail/${order.id}`}
                    className="text-blue-500"
                  >
                    View Detail
                  </Link>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
OrderListPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
export default OrderListPage
