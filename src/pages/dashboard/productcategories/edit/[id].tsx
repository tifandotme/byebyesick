import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useRouter } from "next/router"
import ProductCategoriesLayout from "@/features/productcategories/components/layout"

import type { ProductsCategoriesSchema } from "@/types/api"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import ProductCategoriesForm from "@/components/forms/product-categories-form"
import { DashboardLayout } from "@/components/layouts/dashboard"

export const getServerSideProps: GetServerSideProps<{
  data: ProductsCategoriesSchema
}> = async (context) => {
  const id = context.query.id as string
  const res = await fetch(`http://localhost:8080/category/${id}`)
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
  const router = useRouter()

  return (
    <>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Edit post</CardTitle>
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
