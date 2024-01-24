import { DashboardTabs } from "@/components/dashboard-tabs"

export function SalesReportTab() {
  return (
    <DashboardTabs
      tabs={[
        {
          title: "Drug",
          href: `/dashboard/sales-report/drug`,
        },
        {
          title: "Pharmacies",
          href: `/dashboard/sales-report/pharmacy`,
        },
      ]}
    />
  )
}
