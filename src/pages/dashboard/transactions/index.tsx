import React from "react"
import { useRouter } from "next/router"
import useSWR from "swr"

import type { ITransaction, ResponseGetAll } from "@/types/api"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { TransactionTable } from "@/features/admin/table/transactions-table"
import TransactionLayout from "@/features/transactions/layout"

export default function TransactionsTablePage() {
  const router = useRouter()

  const { page, per_page, transaction_status_id } = router.query

  const { data, isLoading, mutate } = useSWR<
    ResponseGetAll<Omit<ITransaction[], "orders">>
  >(() => {
    const params = new URLSearchParams()
    if (per_page) params.set("limit", per_page)
    if (page) params.set("page", page)
    if (transaction_status_id)
      params.set("transaction_status_id", transaction_status_id)

    return `/v1/transactions?${params.toString()}`
  })

  return (
    <>
      <div className="space-y-6 overflow-auto">
        {isLoading && !data && (
          <DataTableSkeleton columnCount={5} filterableFieldCount={0} />
        )}

        {data && (
          <TransactionTable
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

TransactionsTablePage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <TransactionLayout>{page}</TransactionLayout>
    </DashboardLayout>
  )
}
