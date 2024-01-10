import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useRouter } from "next/router"
import useSWR from "swr"

import type { ResponseGetAll, StockMutationReport } from "@/types/api"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { RangeDatePicker } from "@/components/range-date-picker"
import { PharmaciesLayout } from "@/features/pharmacies/components/layout"
import { PharmacyJournalTable } from "@/features/pharmacies/components/tables/pharmacy-journal"
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

export default function PharmacyJournalPage({
  pharmacyId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const { page, per_page, start_date, end_date } = router.query

  const { data, isLoading } = useSWR<ResponseGetAll<StockMutationReport[]>>(
    () => {
      const params = new URLSearchParams()
      params.set("pharmacy_id", pharmacyId)
      if (page) params.set("page", page)
      if (per_page) params.set("limit", per_page)
      if (start_date && end_date) {
        params.set("start_date", start_date)
        params.set("end_date", end_date)
      }

      return `/v1/report-stock-mutations?${params.toString()}`
    },
  )

  return (
    <div className="space-y-6 overflow-auto">
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
        <h2 className="text-2xl font-bold leading-10 tracking-tight">
          Journal
        </h2>
        <RangeDatePicker />
      </div>

      {isLoading && !data && (
        <DataTableSkeleton
          columnCount={6}
          filterableFieldCount={0}
          isSearchable={false}
        />
      )}
      {data && (
        <PharmacyJournalTable
          data={data.data.items}
          pageCount={data.data.total_pages}
        />
      )}
    </div>
  )
}

PharmacyJournalPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <PharmaciesLayout>
        <PharmaciesTabs />
        {page}
      </PharmaciesLayout>
    </DashboardLayout>
  )
}
