import React from "react"
import useSWR from "swr"

import type { Pharmacy, ResponseGetAll } from "@/types/api"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { PharmaciesLayout } from "@/features/pharmacies/components/layout"
import { PharmacyTable } from "@/features/pharmacies/components/table"

export default function PharmacyPage() {
  const { data, isLoading } =
    useSWR<ResponseGetAll<Pharmacy[]>>("/v1/pharmacies?")

  return (
    <div className="space-y-6 overflow-auto">
      {isLoading && (
        <DataTableSkeleton columnCount={4} filterableFieldCount={0} />
      )}
      {!isLoading && data && <PharmacyTable data={data?.data.items} />}
    </div>
  )
}

PharmacyPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <PharmaciesLayout>{page}</PharmaciesLayout>
    </DashboardLayout>
  )
}
