import React from "react"
import type { ColumnDef } from "@tanstack/react-table"

import type { IPharmacySalesReportByPharmacy } from "@/types/api"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"

interface PharmacyAnalyticsTableProps {
  data: IPharmacySalesReportByPharmacy[]
  pageCount: number
}

export function PharmacyAnalyticTable({
  data: pharmacyAnalytics,
  pageCount,
}: PharmacyAnalyticsTableProps) {
  const data = pharmacyAnalytics.map((pharmacy) => ({
    name: pharmacy.pharmacy_name,
    total_sale: pharmacy.total_sells,
  }))

  type Data = (typeof data)[number]

  const columns = React.useMemo<ColumnDef<Data, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        enableHiding: false,
        enableSorting: false,
        minSize: 150,
        maxSize: 150,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Pharmacy Name" />
        ),
      },
      {
        accessorKey: "total_sale",
        enableSorting: false,
        minSize: 150,
        maxSize: 150,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Total Sale" />
        ),
      },
    ],
    [],
  )

  return <DataTable columns={columns} data={data} pageCount={pageCount} />
}
