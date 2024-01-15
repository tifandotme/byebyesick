import React from "react"
import { useRouter } from "next/router"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  Cross2Icon,
} from "@radix-ui/react-icons"
import useSWR from "swr"

import type { IManufacturer, ResponseGetAll } from "@/types/api"
import { useDebounce } from "@/hooks/use-debounce"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { DashboardLayout } from "@/components/layouts/dashboard"
import ManufacturerLayout from "@/features/manufacturers/layout"
import { ManufacturersCard } from "@/features/manufacturers/manufacturers-card"
import { PharmacyCardSkeleton } from "@/features/pharmacies/components/pharmacy-card-skeleton"

export default function ManufacturersPage() {
  const router = useRouter()

  const { search, sort } = router.query

  const { data, isLoading } = useSWR<ResponseGetAll<IManufacturer[]>>(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (sort) params.set("sort_by", sort.split(".")[0] as string)
    if (sort) params.set("sort", sort.split(".")[1] as string)

    return `/v1/manufacturers?${params.toString()}`
  })

  return (
    <>
      <ManufacturersToolbar />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          !data &&
          Array.from({ length: 3 }).map((_, i) => (
            <PharmacyCardSkeleton key={i} />
          ))}
        {data?.data.items.length === 0 && (
          <span className="col-span-full my-5 text-center">
            No manufacturers found.
          </span>
        )}
        {data?.data.items.map((manufacturer) => (
          <ManufacturersCard
            key={manufacturer.id}
            manufacturer={manufacturer}
            href={`/dashboard/manufacturers/edit/${manufacturer.id}`}
          />
        ))}
      </section>
    </>
  )
}

function ManufacturersToolbar() {
  const router = useRouter()

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

  const [query, setQuery] = React.useState("")
  const debouncedQuery = useDebounce(query, 500)

  React.useEffect(
    () => {
      if (debouncedQuery) {
        router.push(
          {
            pathname: router.asPath.split("?")[0],
            query: createQueryString({ search: debouncedQuery }),
          },
          undefined,
          { shallow: true, scroll: false },
        )
      } else {
        router.push(
          {
            pathname: router.asPath.split("?")[0],
            query: createQueryString({ search: null }),
          },
          undefined,
          { shallow: true, scroll: false },
        )
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedQuery],
  )

  const [column, order] =
    new URLSearchParams(router.asPath.split("?")[1])?.get("sort")?.split(".") ??
    []

  const [sorting, setSorting] = React.useState({
    id: column ?? "",
    order: order ?? "",
  })

  React.useEffect(() => {
    router.push(
      {
        pathname: router.asPath.split("?")[0],
        query: createQueryString({
          sort: sorting.id ? `${sorting.id}.${sorting.order}` : null,
        }),
      },
      undefined,
      { shallow: true, scroll: false },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting])

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Search manufacturers..."
        onChange={(e) => setQuery(e.target.value)}
        value={query}
        className="h-8 w-fit"
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 data-[state=open]:bg-accent"
          >
            <span>Sort</span>
            {sorting.order === "desc" ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : sorting.order === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <CaretSortIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onSelect={() =>
              setSorting({
                id: "name",
                order: "asc",
              })
            }
          >
            <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() =>
              setSorting({
                id: "name",
                order: "desc",
              })
            }
          >
            <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          {sorting.id && (
            <DropdownMenuItem
              onClick={() =>
                setSorting({
                  id: "",
                  order: "",
                })
              }
            >
              <Cross2Icon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              Reset
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

ManufacturersPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <ManufacturerLayout>{page}</ManufacturerLayout>
    </DashboardLayout>
  )
}
