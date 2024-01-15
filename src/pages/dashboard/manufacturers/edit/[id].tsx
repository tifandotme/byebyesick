import type { GetServerSideProps, InferGetServerSidePropsType } from "next"

import type { ProductsCategoriesSchema } from "@/types/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  console.log(data)
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
