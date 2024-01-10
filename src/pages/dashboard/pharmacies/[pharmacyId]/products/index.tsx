import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import useSWR from "swr"

import type { PharmacyProduct, ResponseGetAll } from "@/types/api"
import { Button } from "@/components/ui/button"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { PharmaciesLayout } from "@/features/pharmacies/components/layout"
import { PharmacyProductsTable } from "@/features/pharmacies/components/tables/pharmacy-products"
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

export default function PharmacyProductsPage({
  pharmacyId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const { page, per_page, search, sort } = router.query

  const { data, isLoading, mutate } = useSWR<ResponseGetAll<PharmacyProduct[]>>(
    () => {
      const params = new URLSearchParams()
      params.set("pharmacy_id", pharmacyId)
      if (page) params.set("page", page)
      if (per_page) params.set("limit", per_page)
      if (search) params.set("search", search)
      if (sort) params.set("sort_by", sort.split(".")[0] as string)
      if (sort) params.set("sort", sort.split(".")[1] as string)

      return `/v1/pharmacy-products?${params.toString()}`
    },
  )

  return (
    <div className="space-y-6 overflow-auto">
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
        <h2 className="text-2xl font-bold leading-10 tracking-tight">
          Products
        </h2>
        <Button size="sm" className="w-fit" asChild>
          <Link href={`/dashboard/pharmacies/${pharmacyId}/products/add`}>
            Add product
          </Link>
        </Button>
      </div>

      {isLoading && !data && (
        <DataTableSkeleton columnCount={5} filterableFieldCount={0} />
      )}
      {data && (
        <PharmacyProductsTable
          data={data.data.items}
          pageCount={data.data.total_pages}
          mutate={mutate}
        />
      )}
    </div>
  )
}

PharmacyProductsPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <PharmaciesLayout>
        <PharmaciesTabs />
        {page}
      </PharmaciesLayout>
    </DashboardLayout>
  )
}
