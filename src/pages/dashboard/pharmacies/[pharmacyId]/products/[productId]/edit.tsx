import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useRouter } from "next/router"
import useSWR from "swr"

import type { PharmacyProductById, ResponseById } from "@/types/api"
import { removeLastSegment } from "@/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { PharmacyProductForm } from "@/features/pharmacies/components/forms/pharmacy-product"
import { PharmaciesLayout } from "@/features/pharmacies/components/layout"
import { PharmaciesTabs } from "@/features/pharmacies/components/tabs"

export const getServerSideProps: GetServerSideProps<{
  productId: string
}> = async (context) => {
  const productId = context.params?.productId as string | undefined

  if (!productId || isNaN(Number(productId))) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      productId,
    },
  }
}

export default function EditPharmacyProductPage({
  productId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()

  const { data, isLoading } = useSWR<ResponseById<PharmacyProductById>>(
    `/v1/pharmacy-products/${productId}`,
    {
      onError: () => {
        router.push(removeLastSegment(router.asPath, 2))
      },
    },
  )

  return (
    <>
      {isLoading && <PharmacyProductFormSkeleton />}
      {data && (
        <Card>
          <CardHeader className="space-y-1 p-4 sm:p-6">
            <CardTitle className="text-2xl">Edit product</CardTitle>
            <CardDescription>Edit a product in your pharmacy</CardDescription>
          </CardHeader>
          <CardContent className="p-4 !pt-0 sm:p-6">
            <PharmacyProductForm mode="edit" initialData={data.data} />
          </CardContent>
        </Card>
      )}
    </>
  )
}

function PharmacyProductFormSkeleton() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <Skeleton className="h-8 w-1/5" />
        <Skeleton className="h-5 w-2/6" />
      </CardHeader>
      <CardContent>
        <div className="grid w-full max-w-2xl gap-5">
          <div className="space-y-2.5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-[74px]" />
          </div>
          <div className="space-y-2.5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10" />
          </div>
          <div className="space-y-2.5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-1/6" />
            <Skeleton className="h-5 w-2/5" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="mt-4 h-10 w-24" />
      </CardFooter>
    </Card>
  )
}

EditPharmacyProductPage.getLayout = function getLayout(
  page: React.ReactElement,
) {
  return (
    <DashboardLayout>
      <PharmaciesLayout>
        <PharmaciesTabs />
        {page}
      </PharmaciesLayout>
    </DashboardLayout>
  )
}
