import React from "react"
import { useRouter } from "next/router"
import { Cross2Icon } from "@radix-ui/react-icons"
import type { Table } from "@tanstack/react-table"

import type { DataTableFilterableColumn } from "@/types"
import { useDebounce } from "@/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import { DataTableFilter } from "@/components/ui/data-table/data-table-filter"
import { DataTableViewOptions } from "@/components/ui/data-table/data-table-view-options"
import { Input } from "@/components/ui/input"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterableColumns?: DataTableFilterableColumn<TData>[]
  includeSearch?: boolean
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns = [],
  includeSearch = true,
}: DataTableToolbarProps<TData>) {
  const router = useRouter()

  const isFiltered = table.getState().columnFilters.length > 0

  const searchParams = React.useMemo(
    () => new URLSearchParams(router.asPath.split("?")[1]),
    [router.asPath],
  )

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = searchParams

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      }

      return newSearchParams.toString()
    },
    [searchParams],
  )

  const [query, setQuery] = React.useState(router.query.search ?? "")
  const debouncedQuery = useDebounce(query, 500)

  React.useEffect(
    () => {
      if (debouncedQuery) {
        router.replace(
          {
            pathname: router.asPath.split("?")[0],
            query: createQueryString({ search: debouncedQuery }),
          },
          undefined,
          { shallow: true },
        )
      } else {
        router.replace(
          {
            pathname: router.asPath.split("?")[0],
            query: createQueryString({ search: null }),
          },
          undefined,
          { shallow: true },
        )
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedQuery],
  )

  return (
    <div className="flex w-full items-center justify-between space-x-2 overflow-auto p-1">
      <div className="flex flex-1 items-center space-x-2">
        {includeSearch && (
          <Input
            placeholder={`Search...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}

        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(column.id ? String(column.id) : "") && (
                <DataTableFilter
                  key={String(column.id)}
                  column={table.getColumn(column.id ? String(column.id) : "")}
                  title={column.title}
                  options={column.options}
                />
              ),
          )}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
