import React from "react"
import type { ColumnDef } from "@tanstack/react-table"

import type { Option } from "@/types"
import type { IPharmacySalesReportByPharmacy } from "@/types/api"
import { formatPrice } from "@/lib/utils"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"

interface PharmacyAnalyticsTableProps {
  data: IPharmacySalesReportByPharmacy[]
  pageCount: number
}

const minOffset = 0,
  maxOffset = 20
const thisYear = new Date().getFullYear()
const allYears = []
for (let x = minOffset; x <= maxOffset; x++) {
  allYears.push(thisYear - x)
}
const yearFilter: Option[] = allYears.map((year) => ({
  label: year.toString(),
  value: year.toString(),
}))

export function PharmacyAnalyticTable({
  data: pharmacyAnalytics,
  pageCount,
}: PharmacyAnalyticsTableProps) {
  const data = pharmacyAnalytics.map((pharmacy) => ({
    id: pharmacy.pharmacy_id,
    name: pharmacy.pharmacy_name,
    total_sell: formatPrice(pharmacy.total_sells),
    year: pharmacy.year,
    admin: pharmacy.pharmacy_admin_email,
  }))

  type Data = (typeof data)[number]

  const columns = React.useMemo<ColumnDef<Data, unknown>[]>(
    () => [
      {
        accessorKey: "id",
        enableHiding: false,
        enableSorting: false,
        minSize: 150,
        maxSize: 150,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Pharmacy Id" />
        ),
      },
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
        accessorKey: "total_sell",
        enableSorting: false,
        minSize: 150,
        maxSize: 150,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Total Sale" />
        ),
      },
      {
        accessorKey: "year",
        enableHiding: false,
        enableSorting: false,
        minSize: 150,
        maxSize: 150,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Year" />
        ),
      },
      {
        accessorKey: "admin",
        enableHiding: false,
        enableSorting: false,
        minSize: 150,
        maxSize: 150,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Admin" />
        ),
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      filterableColumns={[
        {
          id: "year",
          title: "Year",
          options: yearFilter,
        },
      ]}
    />
  )
}
