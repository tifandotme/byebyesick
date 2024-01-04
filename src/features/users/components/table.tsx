import React from "react"
import Link from "next/link"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"

import type { User } from "@/types/api"
import { usersRoleIds } from "@/config"
import { toSentenceCase } from "@/lib/utils"
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

interface UsersTableProps {
  data: User[]
}

export function UsersTable({ data: users }: UsersTableProps) {
  const data = users.map((user) => ({
    id: user.id,
    email: user.email,
    role: usersRoleIds[user.user_role_id],
    isVerified: user.is_verified ? "verified" : "not verified",
  }))

  type Data = (typeof data)[number]

  const columns = React.useMemo<ColumnDef<Data, unknown>[]>(
    () => [
      {
        accessorKey: "email",
        enableHiding: false,
        minSize: 270,
        maxSize: 270,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Email" />
        ),
      },
      {
        accessorKey: "role",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ cell }) => {
          const role = cell.getValue() as Data["role"]

          return toSentenceCase(role)
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
        },
      },
      {
        accessorKey: "isVerified",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue() as Data["isVerified"]

          return <Badge variant="secondary">{toSentenceCase(status)}</Badge>
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id))
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
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
              >
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[130px]">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/users/edit/${row.original.id}`}>
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
      filterableColumns={[
        {
          id: "role",
          title: "Role",
          options: Object.values(usersRoleIds).map((role) => ({
            label: toSentenceCase(role),
            value: role,
          })),
        },
        {
          id: "isVerified",
          title: "Status",
          options: (["verified", "not verified"] as const).map((status) => ({
            label: toSentenceCase(status),
            value: status,
          })),
        },
      ]}
      searchableColumns={[
        {
          id: "email",
          title: "Email",
        },
      ]}
    />
  )
}
