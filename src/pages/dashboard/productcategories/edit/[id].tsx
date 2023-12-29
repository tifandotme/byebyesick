import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useRouter } from "next/router"
import ProductCategoriesLayout from "@/features/productcategories/components/layout"
import useSWR from "swr"

import type { ProductsCategories } from "@/types/api"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import ProductCategoriesForm from "@/components/forms/product-categories-form"
import { DashboardLayout } from "@/components/layouts/dashboard"

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

export default function EditProductCategoriesPage({
  id,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()

  const { data, isLoading } = useSWR<ProductsCategories>(
    `/products-categories/${id}`,
    {
      onError: () => {
        router.push("/dashboard/productcategories")
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
            <CardTitle className="text-2xl">Edit post</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductCategoriesForm mode="edit" initialProductData={data} />
          </CardContent>
        </Card>
      )}
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
