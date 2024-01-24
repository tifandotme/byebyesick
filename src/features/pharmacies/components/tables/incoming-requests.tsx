import React from "react"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import type { KeyedMutator } from "swr"

import type { IncomingRequest } from "@/types/api"
import { updateStockMutationRequestStatus } from "@/lib/fetchers"
import { cn, formatDate, toSentenceCase } from "@/lib/utils"
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

interface IncomingRequestsTableProps {
  data: IncomingRequest[]
  pageCount: number
  mutate: KeyedMutator<any>
}

export function IncomingRequestsTable({
  data: incomingRequests,
  pageCount,
  mutate,
}: IncomingRequestsTableProps) {
  const data = incomingRequests.map((request) => ({
    id: request.id,
    requester: request.pharmacy_product_dest.pharmacy.name,
    name: request.pharmacy_product_dest.product.name,
    genericName: request.pharmacy_product_dest.product.generic_name,
    manufacturer: request.pharmacy_product_dest.product.manufacturer.name,
    statusId: request.product_stock_mutation_request_status_id,
    status: request.product_stock_mutation_request_status.name,
    amount: request.stock,
    date: request.request_date,
  }))

  type Data = (typeof data)[number]

  const columns = React.useMemo<ColumnDef<Data, unknown>[]>(
    () => [
      {
        accessorKey: "requester",
        enableHiding: false,
        enableSorting: false,
        minSize: 150,
        maxSize: 150,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Requester" />
        ),
      },
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
        accessorKey: "statusId",
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ cell, row }) => {
          const statusId = cell.getValue() as Data["statusId"]

          const bgColor: Record<typeof statusId, string> = {
            1: "bg-yellow-200 hover:bg-yellow-200/70 dark:bg-yellow-950 hover:dark:bg-yellow-950/70",
            2: "bg-green-200 hover:bg-green-200/70 dark:bg-green-950 hover:dark:bg-green-950/70",
            3: "bg-red-200 hover:bg-red-200/70 dark:bg-red-950 hover:dark:bg-red-950/70",
          }

          return (
            <Badge
              variant="secondary"
              className={cn("cursor-default", bgColor[statusId])}
            >
              {toSentenceCase(row.original.status)}
            </Badge>
          )
        },
      },
      {
        accessorKey: "amount",
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Amount" />
        ),
      },
      {
        accessorKey: "date",
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Date" />
        ),
        cell: ({ cell }) => {
          const date = cell.getValue() as Data["date"]

          return <span>{formatDate(date, true)}</span>
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
              <DropdownMenuItem
                disabled={row.original.statusId !== 1}
                onClick={() => {
                  const handleApproval = async () => {
                    const { success } = await updateStockMutationRequestStatus(
                      {
                        product_stock_mutation_request_status_id: 2,
                      },
                      row.original.id,
                    )

                    if (!success) throw new Error()
                    await mutate()
                  }

                  toast.promise(handleApproval(), {
                    loading: "Approving request...",
                    success: "Request approved",
                    error: "Failed to approve request",
                  })
                }}
              >
                Accept
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={row.original.statusId !== 1}
                onClick={() => {
                  const handleApproval = async () => {
                    const { success } = await updateStockMutationRequestStatus(
                      {
                        product_stock_mutation_request_status_id: 3,
                      },
                      row.original.id,
                    )

                    if (!success) throw new Error()
                    await mutate()
                  }

                  toast.promise(handleApproval(), {
                    loading: "Rejecting request...",
                    success: "Request rejected",
                    error: "Failed to reject request",
                  })
                }}
              >
                Reject
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
      data={data}
      pageCount={pageCount}
      includeSearch={false}
      filterableColumns={[
        {
          id: "statusId",
          title: "Status",
          options: [
            { label: "Pending", value: "1" },
            { label: "Accepted", value: "2" },
            { label: "Rejected", value: "3" },
          ],
        },
      ]}
    />
  )
}
