import React from "react"
import { type ColumnDef } from "@tanstack/react-table"

import type { StockMutationReport } from "@/types/api"
import { cn, formatDate, toSentenceCase } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"

interface PharmacyJournalTableProps {
  data: StockMutationReport[]
  pageCount: number
}

export function PharmacyJournalTable({
  data: stockMutations,
  pageCount,
}: PharmacyJournalTableProps) {
  const data = stockMutations.map((mutation) => ({
    id: mutation.id,
    type:
      mutation.product_stock_mutation_type_id === 1 ? "addition" : "deduction",
    name: mutation.pharmacy_product.product.name,
    genericName: mutation.pharmacy_product.product.generic_name,
    manufacturer: mutation.pharmacy_product.product.manufacturer.name,
    amount: mutation.stock,
    date: mutation.mutation_date,
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
          <DataTableColumnHeader column={column} title="Name" />
        ),
      },
      {
        accessorKey: "genericName",
        enableSorting: false,
        minSize: 150,
        maxSize: 150,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Generic Name" />
        ),
      },
      {
        accessorKey: "manufacturer",
        enableSorting: false,
        maxSize: 190,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Manufacturer" />
        ),
      },
      {
        accessorKey: "amount",
        enableHiding: false,
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Amount" />
        ),
      },
      {
        accessorKey: "type",
        enableHiding: false,
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Type" />
        ),
        cell: ({ cell }) => {
          const type = cell.getValue() as Data["type"]

          return (
            <Badge
              variant="secondary"
              className={cn(
                "cursor-default",
                type === "addition"
                  ? "bg-green-200 hover:bg-green-200/70 dark:bg-green-950 hover:dark:bg-green-950/70"
                  : "bg-red-200 hover:bg-red-200/70 dark:bg-red-950 hover:dark:bg-red-950/70",
              )}
            >
              {toSentenceCase(type)}
            </Badge>
          )
        },
      },
      {
        accessorKey: "date",
        enableHiding: false,
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ cell }) => {
          const date = cell.getValue() as Data["date"]

          return <span>{formatDate(date, true)}</span>
        },
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      includeSearch={false}
    />
  )
}
