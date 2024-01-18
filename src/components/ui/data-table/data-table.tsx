import React from "react"
import { useRouter } from "next/router"
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"

import type { DataTableFilterableColumn } from "@/types"
import { updateQueryParams } from "@/lib/utils"
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination"
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  filterableColumns?: DataTableFilterableColumn<TData>[]
  includeSearch?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  filterableColumns = [],
  includeSearch = true,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()

  const pathname = router.asPath.split("?")[0]

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(router.asPath.split("?")[1])

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      }

      return newSearchParams.toString()
    },
    [router.asPath],
  )

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )

  const page = router.query.page ?? "1"
  const pageAsNumber = Number(page)
  const fallbackPage =
    isNaN(pageAsNumber) || pageAsNumber < 1 ? 1 : pageAsNumber

  const per_page = router.query.per_page ?? "10"
  const perPageAsNumber = Number(per_page)
  const fallbackPerPage = isNaN(perPageAsNumber) ? 10 : perPageAsNumber

  const sort = new URLSearchParams(router.asPath.split("?")[1])?.get("sort")
  const [column, order] = sort?.split(".") ?? []

  // Server-side pagination
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: fallbackPage - 1,
      pageSize: fallbackPerPage,
    })

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  )

  React.useEffect(() => {
    setPagination({
      pageIndex: fallbackPage - 1,
      pageSize: fallbackPerPage,
    })
  }, [fallbackPage, fallbackPerPage])

  React.useEffect(() => {
    updateQueryParams(router, {
      page: String(pageIndex + 1),
      per_page: String(pageSize),
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, pageSize])

  // Server-side filtering
  const filterableColumnFilters = columnFilters.filter((filter) => {
    return filterableColumns.find((column) => column.id === filter.id)
  })

  React.useEffect(() => {
    for (const column of filterableColumnFilters) {
      if (typeof column.value === "string") {
        router.replace(
          {
            pathname,
            query: createQueryString({
              page: 1,
              [column.id]: column.value,
            }),
          },
          undefined,
          { shallow: true },
        )
      }
    }

    for (const key of Object.keys(router.query)) {
      if (
        filterableColumns.find((column) => column.id === key) &&
        !filterableColumnFilters.find((column) => column.id === key)
      ) {
        router.replace(
          {
            pathname,
            query: createQueryString({
              page: 1,
              [key]: null,
            }),
          },
          undefined,
          { shallow: true },
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterableColumnFilters])

  // Server-side sorting
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: column ?? "",
      desc: order === "desc",
    },
  ])

  React.useEffect(() => {
    router.replace(
      {
        pathname,
        query: createQueryString({
          page: 1,
          sort: sorting[0]?.id
            ? `${sorting[0]?.id}.${sorting[0]?.desc ? "desc" : "asc"}`
            : null,
        }),
      },
      undefined,
      { shallow: true },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting])

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: {
      columnVisibility,
      columnFilters,
      sorting,
      pagination,
    },

    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
  })

  return (
    <div className="w-full space-y-3 overflow-auto">
      <DataTableToolbar
        table={table}
        filterableColumns={filterableColumns}
        includeSearch={includeSearch}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    const maxWidth =
                      cell.column.columnDef.maxSize !== Number.MAX_SAFE_INTEGER
                        ? cell.column.columnDef.maxSize
                        : undefined
                    const minWidth = cell.column.columnDef.minSize

                    return (
                      <TableCell
                        key={cell.id}
                        className="h-[65px] truncate whitespace-nowrap"
                        style={{ maxWidth, minWidth }}
                      >
                        {maxWidth ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span>
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext(),
                                  )}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="bottom">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : (
                          <>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </>
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
