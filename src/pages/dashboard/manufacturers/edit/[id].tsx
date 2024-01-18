import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useRouter } from "next/router"
import { toast } from "sonner"

import type { ProductsCategoriesSchema } from "@/types/api"
import { deleteManufacturers } from "@/lib/fetchers"
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
import ManufacturersForm from "@/components/forms/manufacturers-form"
import { DashboardLayout } from "@/components/layouts/dashboard"
import ManufacturerLayout from "@/features/manufacturers/layout"

export const getServerSideProps: GetServerSideProps<{
  data: ProductsCategoriesSchema
}> = async (context) => {
  const id = context.query.id as string
  const url = new URL(`/v1/manufacturers/${id}`, process.env.NEXT_PUBLIC_DB_URL)
  const res = await fetch(url)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      data,
    },
  }
}

export default function EditManufacturersPage({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()

  return (
    <>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Edit Manufacturers</CardTitle>
        </CardHeader>
        <CardContent>
          <ManufacturersForm mode="edit" initialProductData={data} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-destructive">
            Delete Manufacturer
          </CardTitle>
        </CardHeader>
        <CardContent>
          Deleting this manufacturer will also delete all data associated with
          it.
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
                      const { success, message } = await deleteManufacturers(
                        Number(data.data.id),
                      )
                      if (!success) throw new Error(message)

                      router.push("/dashboard/manufacturers")

                      return message
                    }

                    toast.promise(handleDeletion(), {
                      loading: "Deleting manufacturer...",
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

EditManufacturersPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <ManufacturerLayout>{page}</ManufacturerLayout>
    </DashboardLayout>
  )
}
