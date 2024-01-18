import React from "react"
import Link from "next/link"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import type { ColumnDef } from "@tanstack/react-table"
import type { KeyedMutator } from "swr"

import type { PharmacyProduct } from "@/types/api"
import { cn, toSentenceCase } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RequestPharmacyProductForm } from "@/features/pharmacies/components/forms/request-pharmacy-product"
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
  const data = pharmacyProducts.map((product) => ({
    id: product.id,
    pharmacyId: product.pharmacy_id,
    name: product.product.name,
    genericName: product.product.generic_name,
    manufacturer: product.product.manufacturer.name,
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

          return (
            <Badge
              variant="secondary"
              className={cn(
                "cursor-default",
                status === "active"
                  ? "bg-green-200 hover:bg-green-200/70 dark:bg-green-950 hover:dark:bg-green-950/70"
                  : "bg-red-200 hover:bg-red-200/70 dark:bg-red-950 hover:dark:bg-red-950/70",
              )}
            >
              {toSentenceCase(status)}
            </Badge>
          )
        },
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <DotsHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[130px]">
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/pharmacies/${row.original.pharmacyId}/products/${row.original.id}/edit`}
                >
                  Edit product
                </Link>
              </DropdownMenuItem>
              <UpdateStockDialog
                pharmacyProductId={row.original.id}
                mutate={mutate}
                currStock={row.original.stock}
              />
              <RequestStockDialog
                pharmacyProductId={row.original.id}
                mutate={mutate}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [mutate],
  )

  return <DataTable columns={columns} data={data} pageCount={pageCount} />
}

interface UpdateStockDialogProps {
  pharmacyProductId: number
  mutate: KeyedMutator<any>
  currStock: number
}

function UpdateStockDialog({
  pharmacyProductId,
  mutate,
  currStock,
}: UpdateStockDialogProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault()
          }}
        >
          Update stock
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Update stock</DialogTitle>
          <DialogDescription>
            The <strong>Journal</strong> will be updated after each succesful
            mutation.
          </DialogDescription>
        </DialogHeader>
        <StockMutationForm
          onFormSubmit={() => setOpen(false)}
          pharmacyProductId={pharmacyProductId}
          mutate={mutate}
          currStock={currStock}
        />
      </DialogContent>
    </Dialog>
  )
}

interface RequestStockDialogProps {
  pharmacyProductId: number
  mutate: KeyedMutator<any>
}

function RequestStockDialog({
  pharmacyProductId,
  mutate,
}: RequestStockDialogProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault()
          }}
        >
          Request stock
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Request stock</DialogTitle>
          <DialogDescription>
            Request stock from other pharmacies.
          </DialogDescription>
        </DialogHeader>
        <RequestPharmacyProductForm
          onFormSubmit={() => setOpen(false)}
          pharmacyProductId={pharmacyProductId}
          mutate={mutate}
        />
      </DialogContent>
    </Dialog>
  )
}
