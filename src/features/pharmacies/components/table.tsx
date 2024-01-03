import React from "react"
import Link from "next/link"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"

import type { Pharmacy } from "@/types/api"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface PharmacyTableProps {
  data: Pharmacy[]
}

export function PharmacyTable({ data: pharmacies }: PharmacyTableProps) {
  const data = pharmacies.map((pharmacy) => ({
    id: pharmacy.id,
    name: pharmacy.name,
    address: pharmacy.address,
    pharmacistName: pharmacy.pharmacist_name,
    pharmacistPhone: pharmacy.pharmacist_phone_no,
  }))

  type Data = (typeof data)[number]

  const columns = React.useMemo<ColumnDef<Data, unknown>[]>(
    () => [
      {
        accessorKey: "name",
        enableHiding: false,
        maxSize: 200,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Name" />
        ),
      },
      {
        accessorKey: "address",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Address" />
        ),
        cell: ({ cell }) => {
          const address = cell.getValue() as Data["address"]

          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-default">{address}</span>
                </TooltipTrigger>
                <TooltipContent side="bottom">{address}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        },
      },
      {
        accessorKey: "pharmacistName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Pharmacist Name" />
        ),
      },
      {
        accessorKey: "pharmacistPhone",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Pharmacist Phone" />
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
                <Link href={`/dashboard/pharmacies/edit/${row.original.id}`}>
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

  return (
    <DataTable
      columns={columns}
      data={data}
      searchableColumns={[
        {
          id: "name",
          title: "Name",
        },
      ]}
    />
  )
}
