import React from "react"

import { DashboardLayout } from "@/components/layouts/dashboard"
import SalesReportLayout from "@/features/sales-report/components/layout"
import SalesGraphicSection from "@/features/sales-report/components/section/sales-graphic"

function SalesReportPage() {
  return (
    <>
      <SalesGraphicSection />
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
