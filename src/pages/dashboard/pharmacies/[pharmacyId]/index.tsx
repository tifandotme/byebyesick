import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useRouter } from "next/router"
import { toast } from "sonner"
import useSWR from "swr"

import type { Pharmacy, ResponseById } from "@/types/api"
import { deletePharmacy } from "@/lib/fetchers"
import { removeLastSegment } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { PharmacyForm } from "@/features/pharmacies/components/forms/pharmacy"
import { PharmaciesLayout } from "@/features/pharmacies/components/layout"
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

export default function PharmacyPage({
  pharmacyId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()

  const { data, isLoading } = useSWR<ResponseById<Pharmacy>>(
    `/v1/pharmacies/${pharmacyId}`,
    {
      onError: () => {
        router.push(removeLastSegment(router.asPath))
      },
    },
  )

  return (
    <>
      {isLoading && <PharmacyFormSkeleton />}
      {data && (
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Edit pharmacy</CardTitle>
          </CardHeader>
          <CardContent>
            <PharmacyForm mode="edit" initialData={data.data} />
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-destructive">
            Delete pharmacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          Deleting this pharmacy will also delete all data associated with it,
          such as sales report, products, and stock mutation.
        </CardContent>
        <CardFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive" className="w-fit">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="!bg-destructive !text-destructive-foreground"
                  onClick={() => {
                    const handleDeletion = async () => {
                      const { success, message } = await deletePharmacy(
                        Number(pharmacyId),
                      )
                      if (!success) throw new Error(message)

                      router.push(removeLastSegment(router.asPath))

                      return message
                    }

                    toast.promise(handleDeletion(), {
                      loading: "Deleting pharmacy...",
                      success: (message) => message,
                      error: (err) => err.message,
                    })
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </>
  )
}

function PharmacyFormSkeleton() {
  return (
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
            <Skeleton className="h-20" />
          </div>
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="flex gap-2">
              <div className="w-full space-y-2.5">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10" />
              </div>
              <div className="w-full space-y-2.5">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10" />
              </div>
            </div>
          ))}
          <div className="space-y-2.5">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10" />
          </div>
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="flex gap-2">
              <div className="w-full space-y-2.5">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10" />
              </div>
              <div className="w-full space-y-2.5">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  )
}

PharmacyPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <PharmaciesLayout>
        <PharmaciesTabs />
        {page}
      </PharmaciesLayout>
    </DashboardLayout>
  )
}
