import type { GetServerSideProps, InferGetServerSidePropsType } from "next"

import type { ProductsCategoriesSchema } from "@/types/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProductCategoriesForm from "@/components/forms/product-categories-form"
import { DashboardLayout } from "@/components/layouts/dashboard"
import ProductCategoriesLayout from "@/features/productcategories/components/layout"

export const getServerSideProps: GetServerSideProps<{
  data: ProductsCategoriesSchema
}> = async (context) => {
  const id = context.query.id as string
  const url = process.env.NEXT_PUBLIC_DB_URL + `/v1/product-categories/${id}`

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

export default function EditProductCategoriesPage({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Edit Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductCategoriesForm mode="edit" initialProductData={data} />
        </CardContent>
      </Card>
    </>
  )
}

EditProductCategoriesPage.getLayout = function getLayout(
  page: React.ReactElement,
) {
  return (
    <DashboardLayout>
      <ProductCategoriesLayout>{page}</ProductCategoriesLayout>
    </DashboardLayout>
  )
}
