import React from "react"
import Link from "next/link"
import { DotsHorizontalIcon, ExternalLinkIcon } from "@radix-ui/react-icons"
import type { ColumnDef } from "@tanstack/react-table"

import type { ProductElement } from "@/types/fakedata"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProductsTableProps<TData = ProductElement[]> {
  data: TData
}

export function ProductTable({ data: products }: ProductsTableProps) {
  const dat = products.map((m) => ({
    id: m.id,
    title: m.title,
    description: m.description,
  }))

  type Data = (typeof dat)[number]

  const columns = React.useMemo<ColumnDef<Data, unknown>[]>(
    () => [
      {
        accessorKey: "id",
        minSize: 200,
        maxSize: 200,
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="No" />
        ),
        cell: ({ cell }) => {
          const id = cell.getValue() as Data["id"]

          return <span>{id}</span>
        },
      },

      {
        accessorKey: "title",
        minSize: 200,
        maxSize: 200,
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Title" />
        ),
      },
      {
        accessorKey: "description",
        minSize: 250,
        maxSize: 250,
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Description" />
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
                {/* <Link
                  href={`/${row.original.slug}`}
                  target="_blank"
                  className="flex justify-between"
                >
                  View
                  <ExternalLinkIcon className="ml-1.5 h-3.5 w-3.5" />
                </Link> */}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/posts/edit/${row.original.id}`}>
                  Edit
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
  )

  return <DataTable columns={columns} data={dat} />
}
