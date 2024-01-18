import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import useSWR from "swr"

import type { IncomingRequest, ResponseGetAll } from "@/types/api"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { RangeDatePicker } from "@/components/range-date-picker"
import { PharmaciesLayout } from "@/features/pharmacies/components/layout"
import { IncomingRequestsTable } from "@/features/pharmacies/components/tables/incoming-requests"
import { PharmaciesTabs } from "@/features/pharmacies/components/tabs"

export const getServerSideProps: GetServerSideProps<{
  pharmacyId: string
}> = async (context) => {
  const pharmacyId = context.params?.pharmacyId as string | undefined

  if (!pharmacyId || isNaN(Number(pharmacyId))) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      pharmacyId,
    },
  }
}

export default function IncomingRequestsPage({
  pharmacyId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const { page, per_page, sort, start_date, end_date, statusId } = router.query

  const { data, isLoading, mutate } = useSWR<ResponseGetAll<IncomingRequest[]>>(
    () => {
      const params = new URLSearchParams()
      params.set("pharmacy_origin_id", pharmacyId)
      if (page) params.set("page", page)
      if (per_page) params.set("limit", per_page)
      if (sort) params.set("sort_by", sort.split(".")[0] as string)
      if (sort) params.set("sort", sort.split(".")[1] as string)
      if (statusId) params.set("mutation_status_id", statusId as string)
      if (start_date && end_date) {
        params.set("start_date", start_date)
        params.set("end_date", end_date)
      }

      return `/v1/stock-mutations/requests/in?${params.toString()}`
    },
  )

  return (
    <div className="space-y-6 overflow-auto">
      <div className="flex flex-col gap-2">
        <Link
          href={`/dashboard/pharmacies/${pharmacyId}/products`}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "w-fit",
          )}
        >
          &larr; Back
        </Link>
        <div className="flex justify-between">
          <h3 className="text-2xl font-bold leading-10 tracking-tight">
            Incoming Requests
          </h3>
          <RangeDatePicker />
        </div>
      </div>

      {isLoading && !data && (
        <DataTableSkeleton
          columnCount={6}
          filterableFieldCount={1}
          isSearchable={false}
        />
      )}
      {data && (
        <IncomingRequestsTable
          data={data.data.items}
          pageCount={data.data.total_pages}
          mutate={mutate}
        />
      )}
    </div>
  )
}

IncomingRequestsPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <PharmaciesLayout>
        <PharmaciesTabs />
        {page}
      </PharmaciesLayout>
    </DashboardLayout>
  )
}
