import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useRouter } from "next/router"
import { BASE_URL } from "@/pages"
import { toast } from "sonner"

import type { ProductsCategoriesSchema } from "@/types/api"
import { deleteDoctorSpecs } from "@/lib/fetchers"
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
import DoctorSpecsForm from "@/components/forms/doctor-specs-forms"
import { DashboardLayout } from "@/components/layouts/dashboard"
import DoctorSpecsLayout from "@/features/doctor-specs/layout"

export const getServerSideProps: GetServerSideProps<{
  data: ProductsCategoriesSchema
}> = async (context) => {
  const id = context.query.id as string
  const url = BASE_URL + `/v1/doctor-specs/${id}`
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

export default function EditDoctorSpecsPage({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()

  return (
    <>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Edit Doctor Specs</CardTitle>
        </CardHeader>
        <CardContent>
          <DoctorSpecsForm mode="edit" initialProductData={data} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-destructive">
            Delete Doctor Specs
          </CardTitle>
        </CardHeader>
        <CardContent>
          Deleting this Doctor Specs will also delete all data associated with
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
                      const { success, message } = await deleteDoctorSpecs(
                        Number(data.data.id),
                      )
                      if (!success) throw new Error(message)

                      router.push("/dashboard/doctor-specs")

                      return message
                    }

                    toast.promise(handleDeletion(), {
                      loading: "Deleting doctor specs...",
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

EditDoctorSpecsPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <DoctorSpecsLayout>{page}</DoctorSpecsLayout>
    </DashboardLayout>
  )
}
