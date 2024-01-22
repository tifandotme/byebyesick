import React from "react"

import { DashboardLayout } from "@/components/layouts/dashboard"
import SalesReportLayout from "@/features/sales-report/components/layout"
import AnalyticTableSection from "@/features/sales-report/components/section/analytic-section-table/analytic-table-section"
import SalesGraphicSection from "@/features/sales-report/components/section/sales-graphic"

function SalesReportPage() {
  return (
    <>
      <SalesGraphicSection />
      <AnalyticTableSection />
    </>
  )
}

SalesReportPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <SalesReportLayout>{page}</SalesReportLayout>
    </DashboardLayout>
  )
}

export default SalesReportPage
