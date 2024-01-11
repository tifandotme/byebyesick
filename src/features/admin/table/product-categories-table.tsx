import React from "react"
import Link from "next/link"
import { DotsHorizontalIcon, ExternalLinkIcon } from "@radix-ui/react-icons"
import type { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import type { KeyedMutator } from "swr"

import type { IProductCategory, ResponseGetAll } from "@/types/api"
import { deleteProductCategory } from "@/lib/fetchers"
import {
  AlertDialog,
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

interface ProductsTableProps<TData = IProductCategory[]> {
  data: TData
  mutate: KeyedMutator<ResponseGetAll<TData>>
  pageCount: number
}

export function ProductCategoriesTable({
  data,
  mutate,
  pageCount,
}: ProductsTableProps) {
  const productscategories = data.map((m, index) => ({
    id: index + 1,
    name: m.name,
  }))

  type Data = (typeof productscategories)[number]

  const columns = React.useMemo<ColumnDef<Data, unknown>[]>(
    () => [
      {
        accessorKey: "id",
        minSize: 200,
        maxSize: 200,
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
        id: "actions",
        cell: ({ row }) => (
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
                  href={`/${row.original.id}`}
                  target="_blank"
                  className="flex justify-between"
                >
                  View
                  <ExternalLinkIcon className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/dashboard/productcategories/edit/${row.original.id}`}
                >
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
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>

                      <Button
                        variant="destructive"
                        onClick={() => {
                          const handleDeletion = async () => {
                            const { success } = await deleteProductCategory(
                              row.original.id,
                            )

                            if (!success) throw new Error()
                            await mutate()
                          }

                          toast.promise(handleDeletion(), {
                            loading: "Deleting category...",
                            success: "category deleted successfully",
                            error: "Failed to delete category",
                          })
                        }}
                      >
                        Delete
                      </Button>
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
      data={productscategories}
      pageCount={pageCount}
    />
  )
}
