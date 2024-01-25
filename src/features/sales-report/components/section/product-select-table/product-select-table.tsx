import React from "react"
import Link from "next/link"
import type { ColumnDef } from "@tanstack/react-table"
import { MousePointerSquareIcon } from "lucide-react"

import type { IProduct } from "@/types/api"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table/data-table"
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header"

interface ProductsTableProps<TData = IProduct[]> {
  data: TData
  pageCount: number
}

export function ProductSelectTable({ data, pageCount }: ProductsTableProps) {
  const product = data.map((m, index) => ({
    id: index + 1,
    name: m.name,
    generic_name: m.generic_name,
    drug_class: m.drug_classification_id,
    product_category_id: m.product_category_id,
  }))

  type Data = (typeof product)[number]

  const columns = React.useMemo<ColumnDef<Data, unknown>[]>(
    () => [
      {
        accessorKey: "id",
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
        accessorKey: "drug_class",
        minSize: 250,
        maxSize: 250,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Drug Classification" />
        ),
        cell: ({ cell }) => {
          switch (cell.getValue()) {
            case 1:
              return "Obat Bebas"
            case 2:
              return "Obat Keras"
            case 3:
              return "Obat Bebas Terbatas"
            case 4:
              return "Non Obat"
            default:
              return "Unknown"
          }
        },
      },

      {
        id: "actions",
        cell: ({ row }) => (
          <Link
            href={`/dashboard/sales-report?product_id=${row.original.id}&product_name=${row.original.generic_name}`}
          >
            <Button variant="ghost" className="text-gray-500" size="icon">
              <MousePointerSquareIcon />
            </Button>
          </Link>
        ),
      },
    ],
    [],
  )

  return (
    <DataTable
      columns={columns}
      data={product}
      pageCount={pageCount}
      includeSearch={true}
      filterableColumns={[
        {
          id: "drug_class",
          title: "Classification",
          options: [
            { label: "Obat Bebas", value: "1" },
            { label: "Obat Keras", value: "2" },
            { label: "Obat Bebas Terbatas", value: "3" },
            { label: "Non Obat", value: "4" },
          ],
        },
      ]}
    />
  )
}
