import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import useSWR from "swr"

import type { PharmacyProduct, ResponseGetAll } from "@/types/api"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
      <div className="flex flex-col gap-4">
        <h3 className="text-2xl font-bold leading-10 tracking-tight">
          Stock Transfer
        </h3>

        <div className="flex flex-col gap-2 lg:flex-row">
          <RequestCard
            title="Outgoing Request"
            description={`Your request(s) to other pharmacies`}
            href={`/dashboard/pharmacies/${pharmacyId}/products/outgoing`}
          />
          <RequestCard
            title="Incoming Request"
            description="Other pharmacies requesting to you"
            href={`/dashboard/pharmacies/${pharmacyId}/products/incoming`}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
        <h3 className="text-2xl font-bold leading-10 tracking-tight">
          Products
        </h3>
        <Button size="sm" className="w-fit" asChild>
          <Link href={`/dashboard/pharmacies/${pharmacyId}/products/add`}>
            Add product
          </Link>
        </Button>
      </div>

      {isLoading && !data && (
        <DataTableSkeleton columnCount={7} filterableFieldCount={0} />
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

interface RequestCardProps {
  title: string
  description: string
  href: string
}

function RequestCard({ title, description, href }: RequestCardProps) {
  return (
    <Card className="flex w-full flex-col items-start justify-between gap-4 p-5 xs:flex-row xs:items-center xs:gap-2">
      <div className="flex h-full flex-col justify-around">
        <h3 className="text-lg font-bold">{title}</h3>
        <span className="text-sm text-muted-foreground">{description}</span>
      </div>
      <Link
        href={href}
        className={cn(
          buttonVariants({ variant: "secondary", size: "sm" }),
          "group",
        )}
      >
        View All
        <ArrowRightIcon className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </Card>
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
