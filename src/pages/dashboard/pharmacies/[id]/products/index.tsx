import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Link from "next/link"
import useSWR from "swr"

import type { PharmacyProduct, ResponseGetAll } from "@/types/api"
import { Button } from "@/components/ui/button"
import { DataTableSkeleton } from "@/components/ui/data-table/data-table-skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { PharmaciesLayout } from "@/features/pharmacies/components/layout"
import { PharmacyProductsTable } from "@/features/pharmacies/components/tables/pharmacy-products"
import { PharmaciesTabs } from "@/features/pharmacies/components/tabs"

export const getServerSideProps: GetServerSideProps<{ id: string }> = async (
  context,
) => {
  const id = context.params?.id as string | undefined

  if (!id || isNaN(Number(id))) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      id,
    },
  }
}
export default function PharmacyProductsPage({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, isLoading } = useSWR<ResponseGetAll<PharmacyProduct[]>>(
    `/v1/pharmacy-products?pharmacy_id=${id}`,
  )

  return (
    <div className="space-y-6 overflow-auto">
      <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Products</h2>
        <Button size="sm" className="w-fit" asChild>
          <Link href={`/dashboard/pharmacies/${id}/products/add`}>
            Add product
          </Link>
        </Button>
      </div>

      {isLoading && <DataTableSkeleton columnCount={5} />}
      {!isLoading && data && <PharmacyProductsTable data={data.data.items} />}
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
