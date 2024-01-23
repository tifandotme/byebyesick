import React from "react"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"
import { toast } from "sonner"
import type { KeyedMutator } from "swr"

import type { IOrderResponse } from "@/types/api"
import { updatePharmacyAdminOrder } from "@/lib/fetchers"
import { formatDate, formatPrice } from "@/lib/utils"
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
    status: request.Status.id,
    statusName: request.Status.name,
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
        minSize: 190,
        maxSize: 190,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Requester" />
        ),
      },
      {
        accessorKey: "items",
        enableHiding: false,
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Items" />
        ),
      },
      {
        accessorKey: "status",
        enableSorting: false,
        enableHiding: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue() as number
          switch (status) {
            case 1:
              return (
                <Badge className="bg-orange-500">Waiting For Pharmacy</Badge>
              )
            case 2:
              return <Badge className="bg-green-600">Processed</Badge>
            case 3:
              return <Badge className="bg-yellow-500">Sent</Badge>
            case 4:
              return <Badge className="bg-blue-500">Order Confirmed</Badge>
            case 5:
              return <Badge variant={"destructive"}>Canceled by Pharmacy</Badge>
            case 6:
              return <Badge variant={"destructive"}>Canceled by User</Badge>
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
        cell: ({ row }) => {
          const status = row.getValue("status") as Data["status"]

          return (
            <>
              {status !== 3 && (
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
                    {status !== 2 && (
                      <>
                        <DropdownMenuItem
                          onClick={() => {
                            const handleApproval = async () => {
                              const { success } =
                                await updatePharmacyAdminOrder(
                                  row.original.id,
                                  "accept",
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
                              const { success } =
                                await updatePharmacyAdminOrder(
                                  row.original.id,
                                  "reject",
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
                      </>
                    )}

                    <DropdownMenuItem
                      onClick={() => {
                        const handleApproval = async () => {
                          const { success } = await updatePharmacyAdminOrder(
                            row.original.id,
                            "cancel",
                          )

                          if (!success) throw new Error()
                          await mutate()
                        }

                        toast.promise(handleApproval(), {
                          loading: "Canceling request...",
                          success: "Request canceled",
                          error: "Failed to cancel request",
                        })
                      }}
                    >
                      Cancel
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        const handleApproval = async () => {
                          const { success } = await updatePharmacyAdminOrder(
                            row.original.id,
                            "ship",
                          )

                          if (!success) throw new Error()
                          await mutate()
                        }

                        toast.promise(handleApproval(), {
                          loading: "Canceling Shipping...",
                          success: "Request Shipped",
                          error: "Failed to cancel Shipping",
                        })
                      }}
                    >
                      Ship
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          )
        },
      },
    ],
    [mutate],
  )

  return (
    <DataTable
      columns={columns}
      data={data}
      pageCount={pageCount}
      includeSearch={true}
    />
  )
}
