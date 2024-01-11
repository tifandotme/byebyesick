import React from "react"
import Link from "next/link"
import { DotsHorizontalIcon, ExternalLinkIcon } from "@radix-ui/react-icons"
import type { ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import type { KeyedMutator } from "swr"

import type { IProduct, ResponseGetAll } from "@/types/api"
import {
  deletePost,
  getDrugClassificationName,
  getManufacturerName,
  getProductCategoryName,
} from "@/lib/fetchers"
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
}

export function ProductTable({ data, mutate, pageCount }: ProductsTableProps) {
  const product = data.map((m, index) => ({
    id: index + 1,
    name: m.name,
    generic_name: m.generic_name,
  }))

  type Data = (typeof product)[number]

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
        accessorKey: "generic_name",
        minSize: 250,
        maxSize: 250,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Generic Name" />
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
                  // href={""}
                  target="_blank"
                  className="flex justify-between"
                >
                  View
                  <ExternalLinkIcon className="ml-1.5 h-3.5 w-3.5" />
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
                      <AlertDialogAction
                        onClick={() => {
                          const handleDeletion = async () => {
                            const { success } = await deletePost(
                              row.original.id,
                            )

                            if (!success) throw new Error()
                            await mutate()
                          }

                          toast.promise(handleDeletion(), {
                            loading: "Deleting post...",
                            success: "Post deleted successfully",
                            error: "Failed to delete post",
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
    />
  )
}
