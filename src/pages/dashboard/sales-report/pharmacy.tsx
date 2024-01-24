import React from "react"

import { DashboardLayout } from "@/components/layouts/dashboard"
import SalesReportLayout from "@/features/sales-report/components/layout"
import AnalyticTableSection from "@/features/sales-report/components/section/analytic-section-table/analytic-table-section"

function PharmacySalesReport() {
  return <AnalyticTableSection />
}

PharmacySalesReport.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <SalesReportLayout>{page}</SalesReportLayout>
    </DashboardLayout>
  )
}

export default PharmacySalesReport
