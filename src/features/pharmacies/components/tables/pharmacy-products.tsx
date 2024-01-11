import React from "react"
import Link from "next/link"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"
import type { KeyedMutator } from "swr"

import type { PharmacyProduct } from "@/types/api"
import { toSentenceCase } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StockMutationForm } from "@/features/pharmacies/components/forms/stock-mutation"

interface PharmacyProductsTableProps {
  data: PharmacyProduct[]
  pageCount: number
  mutate: KeyedMutator<any>
}

export function PharmacyProductsTable({
  data: pharmacyProducts,
  pageCount,
  mutate,
}: PharmacyProductsTableProps) {
  const [open, setOpen] = React.useState(false)

  const data = pharmacyProducts.map((product) => ({
    id: product.id,
    pharmacyId: product.pharmacy_id,
    name: product.product.name,
    price: product.price,
    isActive: product.is_active ? "active" : "inactive",
    stock: product.stock,
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
        accessorKey: "price",
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Price" />
        ),
      },
      {
        accessorKey: "stock",
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Stock" />
        ),
      },
      {
        accessorKey: "isActive",
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue() as Data["isActive"]

          return <Badge variant="outline">{toSentenceCase(status)}</Badge>
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <Dialog open={open} onOpenChange={setOpen}>
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
                  <Link
                    href={`/dashboard/pharmacies/${row.original.pharmacyId}/products/${row.original.id}/edit`}
                  >
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DialogTrigger asChild>
                  <DropdownMenuItem>Update stock</DropdownMenuItem>
                </DialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>

            <StockMutationForm
              pharmacyProductId={row.original.id}
              mutate={mutate}
              closeDialog={() => setOpen(false)}
              currStock={row.original.stock}
            />
          </Dialog>
        ),
      },
    ],
    [mutate, open],
  )

  return <DataTable columns={columns} data={data} pageCount={pageCount} />
}
