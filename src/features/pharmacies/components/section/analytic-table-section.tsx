import React from "react"
import { useRouter } from "next/router"
import useSWR from "swr"

import type {
  IPharmacySalesReportByPharmacy,
  ResponseGetAll,
} from "@/types/api"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"

import { PharmacyAnalyticTable } from "../tables/pharmacy-analytics"

function AnalyticTableSection() {
  const router = useRouter()
  const { page, per_page } = router.query
  const { data, isLoading } = useSWR<
    ResponseGetAll<IPharmacySalesReportByPharmacy[]>
  >(() => {
    const params = new URLSearchParams()
    if (page) params.set("page", page)
    if (per_page) params.set("limit", per_page)
    return `/v1/reports/sells/pharmacy-admin${params.toString()}`
  })

  return (
    <div>
      {isLoading && !data && (
        <DataTableSkeleton
          columnCount={6}
          filterableFieldCount={0}
          isSearchable={false}
        />
      )}
      {data && (
        <PharmacyAnalyticTable
          data={data.data.items}
          pageCount={data.data.total_pages}
        />
      )}
      <PharmacyAnalyticTable
        data={[
          {
            pharmacy_admin_email: "yafi.tamfan08@gmail.com",
            pharmacy_id: 1,
            pharmacy_name: "Kimia Farma Kuningan",
            total_sells: 27000,
          },
        ]}
        pageCount={1}
      />
    </div>
  )
}

export default AnalyticTableSection
