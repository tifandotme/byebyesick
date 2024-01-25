import React from "react"
import Link from "next/link"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type ColumnDef } from "@tanstack/react-table"

import type { User } from "@/types/api"
import { usersRoleIds } from "@/config"
import { cn, toSentenceCase } from "@/lib/utils"
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
  pageCount: number
}

export function UsersTable({ data: users, pageCount }: UsersTableProps) {
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
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ cell }) => {
          const role = cell.getValue() as Data["role"]

          return toSentenceCase(role)
        },
      },
      {
        accessorKey: "isVerified",
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ cell }) => {
          const status = cell.getValue() as Data["isVerified"]

          return <Badge variant="secondary">{toSentenceCase(status)}</Badge>
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
                className={cn(
                  "flex size-8 p-0 data-[state=open]:bg-muted",
                  row.original.role !== "pharmacyAdmin" &&
                    "pointer-events-none invisible",
                )}
              >
                <DotsHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[130px]">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/users/${row.original.id}/edit`}>
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

  return <DataTable columns={columns} data={data} pageCount={pageCount} />
}
