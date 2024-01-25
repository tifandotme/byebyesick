import React from "react"

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

import { SalesReportTab } from "./tabs"

export default function SalesReportLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <section className="grid items-center gap-8 pb-8 pt-6 md:py-8">
      <PageHeader className="block md:relative">
        <PageHeaderHeading size="sm">Sales Report</PageHeaderHeading>
        <PageHeaderDescription className="" size="sm">
          View All Pharmacy Sales Report
        </PageHeaderDescription>
      </PageHeader>
      <SalesReportTab />
      {children}
    </section>
  )
}
