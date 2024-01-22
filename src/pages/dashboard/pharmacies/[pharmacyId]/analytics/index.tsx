import React from "react"
import { useRouter } from "next/router"
import useSWR from "swr"

import type { IPharmacySalesReportByMonth, ResponseGetAll } from "@/types/api"
import LineChart from "@/components/chart/lineChart"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { PharmaciesLayout } from "@/features/pharmacies/components/layout"
import AnalyticTableSection from "@/features/pharmacies/components/section/analytic-table-section"
import { PharmaciesTabs } from "@/features/pharmacies/components/tabs"

function AnalyticPage() {
  const router = useRouter()
  const { year, search } = router.query

  const { data, isLoading } = useSWR<
    ResponseGetAll<IPharmacySalesReportByMonth[]>
  >(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (year) params.set("year", year)
    return `/v1/reports/sells/pharmacy-admin${params.toString()}`
  })
  console.log(data)
  return (
    <div className="space-y-6 overflow-auto">
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
        <h3 className="text-2xl font-bold leading-10 tracking-tight">
          Pharmacy Revenue
        </h3>
      </div>
      {isLoading ? <>loading</> : <LineChart />}
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
        <h3 className="text-xl font-bold leading-10 tracking-tight">
          Sales by Pharmacy
        </h3>
      </div>
      <AnalyticTableSection />
    </div>
  )
}

AnalyticPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <PharmaciesLayout>
        <PharmaciesTabs />
        {page}
      </PharmaciesLayout>
    </DashboardLayout>
  )
}

export default AnalyticPage
