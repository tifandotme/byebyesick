import React from "react"

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

export default function TransactionLayout({
  children,
}: React.PropsWithChildren) {
  return (
    <section className="grid items-center gap-8 pb-8 pt-6 md:py-8">
      <PageHeader separated className="block md:relative">
        <PageHeaderHeading size="sm">Transactions</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your transactions
        </PageHeaderDescription>
      </PageHeader>

      {children}
    </section>
  )
}
