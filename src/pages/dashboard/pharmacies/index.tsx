import React from "react"
import useSWR from "swr"

import type { Pharmacy } from "@/types/api"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { PharmaciesLayout } from "@/features/pharmacies/components/layout"
import { PharmacyTable } from "@/features/pharmacies/components/table"

export default function PharmacyPage() {
  const { data, isLoading } = useSWR<Pharmacy[]>(
    "/pharmacies?_sort=name&_order=asc",
  )

  return (
    <div className="space-y-6 overflow-auto">
      {isLoading && <DataTableSkeleton columnCount={5} />}
      {!isLoading && data && <PharmacyTable data={data} />}
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
