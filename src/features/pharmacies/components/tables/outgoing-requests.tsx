import React from "react"
import { type ColumnDef } from "@tanstack/react-table"

import type { OutgoingRequest } from "@/types/api"
import { cn, formatDate, toSentenceCase } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"

interface OutgoingRequestsTableProps {
  data: OutgoingRequest[]
  pageCount: number
}

export function OutgoingRequestsTable({
  data: outgoingRequests,
  pageCount,
}: OutgoingRequestsTableProps) {
  const data = outgoingRequests.map((request) => ({
    id: request.id,
    sender: request.pharmacy_product_origin.pharmacy.name,
    name: request.pharmacy_product_origin.product.name,
    genericName: request.pharmacy_product_origin.product.generic_name,
    manufacturer: request.pharmacy_product_origin.product.manufacturer.name,
    statusId: request.product_stock_mutation_request_status_id,
    status: request.product_stock_mutation_request_status.name,
    amount: request.stock,
    date: request.request_date,
  }))

  type Data = (typeof data)[number]

  const columns = React.useMemo<ColumnDef<Data, unknown>[]>(
    () => [
      {
        accessorKey: "sender",
        enableHiding: false,
        enableSorting: false,
        minSize: 150,
        maxSize: 150,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Sender" />
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
    ],
    [],
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
