import React from "react"
import { useRouter } from "next/router"
import useSWR from "swr"

import type { ResponseGetAll, User } from "@/types/api"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { UsersLayout } from "@/features/users/components/layout"
import { UsersTable } from "@/features/users/components/table"

export default function UsersPage() {
  const router = useRouter()
  const { page, per_page, search, sort } = router.query

  const { data, isLoading, isValidating } = useSWR<ResponseGetAll<User[]>>(
    () => {
      const params = new URLSearchParams()
      if (page) params.set("page", page)
      if (per_page) params.set("limit", per_page)
      if (search) params.set("search", search)
      if (sort) params.set("sort_by", sort.split(".")[0] as string)
      if (sort) params.set("sort", sort.split(".")[1] as string)

      return `/v1/users?${params.toString()}`
    },
  )

  return (
    <div className="space-y-6 overflow-auto">
      {isLoading && !isValidating && (
        <DataTableSkeleton columnCount={4} filterableFieldCount={1} />
      )}
      {data && (
        <UsersTable data={data.data.items} pageCount={data.data.total_pages} />
      )}
    </div>
  )
}

UsersPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <UsersLayout>{page}</UsersLayout>
    </DashboardLayout>
  )
}
