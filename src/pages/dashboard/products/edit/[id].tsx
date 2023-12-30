import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useRouter } from "next/router"
import ProductLayout from "@/features/products/components/layout"
import useSWR from "swr"

import type { Products, ProductsResponse } from "@/types/api"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import ProductForm from "@/components/forms/products-forms"
import { DashboardLayout } from "@/components/layouts/dashboard"

// export const getServerSideProps: GetServerSideProps<{ id: string }> = async (
//   context,
// ) => {
//   const id = context.params?.id as string | undefined

//   if (!id || isNaN(Number(id))) {
//     return {
//       notFound: true,
//     }
//   }

//   return {
//     props: {
//       id,
//     },
//   }
// }

export const getServerSideProps: GetServerSideProps<{
  data: Products
}> = async (context) => {
  const id = context.query.id as string
  const res = await fetch(`http://localhost:8080/items/${id}`)
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
  const router = useRouter()

  // const { data, isLoading } = useSWR<Products>(`/items/${id}`, {
  //   onError: () => {
  //     router.push("/dashboard/products")
  //   },
  // })

  return (
    <>
      {/* {isLoading && (
        <Card>
          <CardHeader className="space-y-1">
            <Skeleton className="w-1/5 h-8" />
          </CardHeader>
          <CardContent>
            <div className="grid w-full max-w-2xl gap-5">
              <div className="space-y-2.5">
                <Skeleton className="w-32 h-5" />
                <Skeleton className="h-10" />
              </div>
              <div className="space-y-2.5">
                <Skeleton className="w-32 h-5" />
                <Skeleton className="h-[218px]" />
              </div>
              <div className="flex gap-2">
                <div className="w-full space-y-2.5">
                  <Skeleton className="w-32 h-5" />
                  <Skeleton className="h-10" />
                </div>
                <div className="w-full space-y-2.5">
                  <Skeleton className="w-32 h-5" />
                  <Skeleton className="h-10" />
                </div>
              </div>
              <Skeleton className="h-[72px]" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="w-24 h-10" />
          </CardFooter>
        </Card>
      )}
      {!isLoading && data && ( */}
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Edit post</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductForm mode="edit" initialProductData={data} />
        </CardContent>
      </Card>
      {/* )} */}
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
