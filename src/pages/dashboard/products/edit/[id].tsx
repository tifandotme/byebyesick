import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import ProductLayout from "@/features/products/components/layout"

import type { ProductsSchema } from "@/types/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProductForm from "@/components/forms/products-forms"
import { DashboardLayout } from "@/components/layouts/dashboard"

export const getServerSideProps: GetServerSideProps<{
  data: ProductsSchema
}> = async (context) => {
  const id = context.query.id as string
  const res = await fetch(`http://10.20.191.30:8080/v1/products/${id}`)
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

export default function EditPostPage({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Edit post</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm mode="edit" initialProductData={data} />
        </CardContent>
      </Card>
    </>
  )
}

EditPostPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <ProductLayout>{page}</ProductLayout>
    </DashboardLayout>
  )
}
