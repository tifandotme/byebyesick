import React from "react"
import Link from "next/link"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"

import type { StockMutationReport } from "@/types/api"
import { toSentenceCase } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  }))

  type Data = (typeof data)[number]

  const columns = React.useMemo<ColumnDef<Data, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        enableHiding: false,
        enableSorting: false,
        maxSize: 200,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
      },
      {
        accessorKey: "genericName",
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Generic Name" />
        ),
      },
      {
        accessorKey: "manufacturer",
        enableSorting: false,
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
        // cell: ({ cell }) => {
        //   const status = cell.getValue() as Data["manufacturer"]

        //   return <Badge variant="outline">{toSentenceCase(status)}</Badge>
        // },
      },
      {
        accessorKey: "type",
        enableHiding: false,
        enableSorting: false,
        maxSize: 174,
        minSize: 174,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Type" />
        ),
        cell: ({ cell }) => {
          const type = cell.getValue() as Data["type"]

          return <Badge variant="outline">{toSentenceCase(type)}</Badge>
        },
      },
      {
        id: "actions",
        // TODO add actions?
        cell: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[130px]">
              <DropdownMenuItem asChild>
                <Link href="#">Edit</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
      includeSearch={false}
    />
  )
}
