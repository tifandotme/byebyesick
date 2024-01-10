import React from "react"
import useSWR from "swr"

import type { Pharmacy, ResponseGetAll } from "@/types/api"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { PharmaciesLayout } from "@/features/pharmacies/components/layout"
import { PharmacyCard } from "@/features/pharmacies/components/pharmacy-card"
import { PharmacyCardSkeleton } from "@/features/pharmacies/components/pharmacy-card-skeleton"

export default function PharmaciesPage() {
  const { data, isLoading } =
    useSWR<ResponseGetAll<Pharmacy[]>>("/v1/pharmacies")

  // TODO add sort and filter button
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {isLoading &&
        Array.from({ length: 3 }).map((_, i) => (
          <PharmacyCardSkeleton key={i} />
        ))}
      {data?.data?.items.length === 0 && (
        <span className="col-span-full my-5 text-center">
          No pharmacies found. Please add a pharmacy.
        </span>
      )}
      {data?.data?.items.map((pharmacy) => (
        <PharmacyCard
          key={pharmacy.id}
          pharmacy={pharmacy}
          href={`/dashboard/pharmacies/${pharmacy.id}`}
        />
      ))}
    </section>
  )
}

PharmaciesPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <PharmaciesLayout>{page}</PharmaciesLayout>
    </DashboardLayout>
  )
}
