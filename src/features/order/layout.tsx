import React from "react"

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

export default function OrderLayout({ children }: React.PropsWithChildren) {
  return (
    <section className="grid items-center gap-8 pb-8 pt-6 md:py-8">
      <PageHeader separated className="block md:relative">
        <PageHeaderHeading size="sm">Orders</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your Orders
        </PageHeaderDescription>
      </PageHeader>

      {children}
    </section>
  )
}
