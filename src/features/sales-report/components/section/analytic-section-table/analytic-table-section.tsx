import React from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import useSWR from "swr"

import type {
  IPharmacySalesReportByPharmacy,
  ResponseGetAll,
} from "@/types/api"
import { PHARMACY_ADMIN_ROLE } from "@/config"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"

import { PharmacyAnalyticTable } from "../../table/pharmacy-sales-report"

function AnalyticTableSection() {
  const { data: session } = useSession()
  const router = useRouter()
  const { page, per_page, search, year } = router.query
  const { data, isLoading } = useSWR<
    ResponseGetAll<IPharmacySalesReportByPharmacy[]>
  >(() => {
    const params = new URLSearchParams()
    if (page) params.set("page", page)
    if (per_page) params.set("limit", per_page)
    if (search) params.set("search", search)
    if (year) {
      params.set("year", year)
    } else {
      params.set("year", new Date().getFullYear().toString())
    }
    if (session?.user.user_role_id === PHARMACY_ADMIN_ROLE)
      return `/v1/reports/sells/pharmacy-admin?${params.toString()}`
    else return `/v1/reports/sells?${params.toString()}`
  })
  return (
    <div>
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
        <h3 className="text-2xl font-bold leading-10 tracking-tight">
          Pharmacy Revenue
        </h3>
      </div>
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
    </div>
  )
}

export default AnalyticTableSection
