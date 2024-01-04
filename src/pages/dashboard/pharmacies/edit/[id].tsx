import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useRouter } from "next/router"
import useSWR from "swr"

import type { Pharmacy, ResponseById } from "@/types/api"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { PharmacyForm } from "@/features/pharmacies/components/form"
import { PharmaciesLayout } from "@/features/pharmacies/components/layout"

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

export default function EditPharmacyPage({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()

  const { data, isLoading } = useSWR<ResponseById<Pharmacy>>(
    `/v1/pharmacies/${id}`,
    {
      onError: () => {
        router.push("/dashboard/pharmacies")
      },
    },
  )

  return (
    <>
      {isLoading && (
        <Card>
          <CardHeader className="space-y-1">
            <Skeleton className="h-8 w-1/5" />
          </CardHeader>
          <CardContent>
            <div className="grid w-full max-w-2xl gap-5">
              <div className="space-y-2.5">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10" />
              </div>
              <div className="space-y-2.5">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-[218px]" />
              </div>
              <div className="flex gap-2">
                <div className="w-full space-y-2.5">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10" />
                </div>
                <div className="w-full space-y-2.5">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10" />
                </div>
              </div>
              <Skeleton className="h-[72px]" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-24" />
          </CardFooter>
        </Card>
      )}
      {!isLoading && data && (
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Edit pharmacy</CardTitle>
          </CardHeader>
          <CardContent>
            <PharmacyForm mode="edit" initialData={data.data} />
          </CardContent>
        </Card>
      )}
    </>
  )
}

EditPharmacyPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <PharmaciesLayout>{page}</PharmaciesLayout>
    </DashboardLayout>
  )
}
