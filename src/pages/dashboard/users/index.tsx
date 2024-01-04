import React from "react"
import useSWR from "swr"

import type { ResponseGetAll, User } from "@/types/api"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { UsersLayout } from "@/features/users/components/layout"
import { UsersTable } from "@/features/users/components/table"

export default function UsersPage() {
  const { data, isLoading } = useSWR<ResponseGetAll<User[]>>("/v1/users")

  return (
    <div className="space-y-6 overflow-auto">
      {isLoading && (
        <DataTableSkeleton columnCount={4} filterableFieldCount={1} />
      )}
      {!isLoading && data && <UsersTable data={data?.data.items} />}
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
