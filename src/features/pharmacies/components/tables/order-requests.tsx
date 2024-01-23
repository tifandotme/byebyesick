import React from "react"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import type { KeyedMutator } from "swr"

import type { IOrderResponse } from "@/types/api"
import { updateStockMutationRequestStatus } from "@/lib/fetchers"
import { cn, formatDate, formatPrice, toSentenceCase } from "@/lib/utils"
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

interface OrderRequestsTableProps {
  data: IOrderResponse[]
  pageCount: number
  mutate: KeyedMutator<any>
}

export function OrderRequestsTable({
  data: OrderRequests,
  pageCount,
  mutate,
}: OrderRequestsTableProps) {
  const data = OrderRequests.map((request) => ({
    id: request.id,
    requester: request.Pharmacy.name,
    Pharmacy: request.Pharmacy.name,
    items: request.no_of_items,

    status: request.Status.name,
    amount: request.total_payment,
    date: request.date,
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
        accessorKey: "statusId",
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue() as number
          switch (status) {
            case 1:
              return <Badge variant={"destructive"}>Unpaid</Badge>
            case 2:
              return <Badge variant={"secondary"}>Waiting for Payment</Badge>
            case 3:
              return <Badge className="bg-yellow-500">Payment Rejected</Badge>
            case 4:
              return <Badge variant={"success"}>Paid</Badge>
            case 5:
              return <Badge variant={"destructive"}>Canceled</Badge>
            default:
              return <Badge variant={"default"}>Unpaid</Badge>
          }
        },
      },
      {
        accessorKey: "amount",
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Amount" />
        ),
        cell: ({ cell }) => {
          const price = cell.getValue() as Data["amount"]
          return <span>{formatPrice(price)}</span>
        },
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
          id: "status",
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
