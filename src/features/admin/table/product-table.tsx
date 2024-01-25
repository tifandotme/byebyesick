import React from "react"
import Link from "next/link"
import { DotsHorizontalIcon, ExternalLinkIcon } from "@radix-ui/react-icons"
import type { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import type { KeyedMutator } from "swr"

import type { IProduct, ResponseGetAll } from "@/types/api"
import { deleteProducts } from "@/lib/fetchers"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProductsTableProps<TData = IProduct[]> {
  data: TData
  mutate: KeyedMutator<ResponseGetAll<TData>>
  pageCount: number
  current_page: number
}

export function ProductTable({
  data,
  mutate,
  pageCount,
  current_page,
}: ProductsTableProps) {
  const product = data.map((m, index) => ({
    id: index + 1,
    num: (current_page - 1) * 10 + (index + 1),
    name: m.name,
    genericName: m.generic_name,
    drug_class: m.drug_classification_id,
    product_category_id: m.product_category_id,
  }))

  type Data = (typeof product)[number]

  const columns = React.useMemo<ColumnDef<Data, unknown>[]>(
    () => [
      {
        accessorKey: "num",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="No" />
        ),
      },

      {
        accessorKey: "name",
        minSize: 200,
        maxSize: 200,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
      },
      {
        accessorKey: "genericName",
        minSize: 250,
        maxSize: 250,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Generic Name" />
        ),
      },

      {
        accessorKey: "drug_class",
        minSize: 250,
        maxSize: 250,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Drug Classification" />
        ),
        cell: ({ cell }) => {
          switch (cell.getValue()) {
            case 1:
              return "Obat Bebas"
            case 2:
              return "Obat Keras"
            case 3:
              return "Obat Bebas Terbatas"
            case 4:
              return "Non Obat"
            default:
              return "Unknown"
          }
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
                  href={`/products/${row.original.id}`}
                  target="_blank"
                  className="flex justify-between"
                >
                  View
                  <ExternalLinkIcon className="ml-1.5 size-3.5" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/products/edit/${row.original.id}`}>
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <AlertDialog>
                  <AlertDialogTrigger className="mb-1.5 ml-2 text-sm">
                    Delete
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete</AlertDialogTitle>
                      <AlertDialogDescription>
                        You are about to delete this product. This action cannot
                        be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          const handleDeletion = async () => {
                            const { success } = await deleteProducts(
                              row.original.id,
                            )

                            if (!success) throw new Error()
                            await mutate()
                          }

                          toast.promise(handleDeletion(), {
                            loading: "Deleting products...",
                            success: "Products deleted successfully",
                            error: "Failed to delete products",
                          })
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [mutate],
  )

  return (
    <DataTable
      columns={columns}
      data={product}
      pageCount={pageCount}
      includeSearch={true}
      filterableColumns={[
        {
          id: "drug_class",
          title: "Classification",
          options: [
            { label: "Obat Bebas", value: "1" },
            { label: "Obat Keras", value: "2" },
            { label: "Obat Bebas Terbatas", value: "3" },
            { label: "Non Obat", value: "4" },
          ],
        },
      ]}
    />
  )
}
