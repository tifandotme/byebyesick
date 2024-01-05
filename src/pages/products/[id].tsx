import React from "react"
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next"

import type { ApiResponse, IProduct, ResponseById } from "@/types/api"
import MainLayout from "@/components/layout/mainLayout"
import DetailProduct from "@/features/drug/component/section/detailProduct"
import OtherProduct from "@/features/drug/component/section/otherProduct"

export const getStaticPaths: GetStaticPaths = async () => {
  const url = new URL("/v1/products", process.env.NEXT_PUBLIC_DB_URL)
  const res = await fetch(url)

  const products: ApiResponse<IProduct[]> = await res.json()

  const paths = products.data.items.map((product) => ({
    params: { id: product.id.toString() },
  }))

  return {
    paths,
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps<{
  product: ResponseById<IProduct>
}> = async (context) => {
  const url = new URL(
    `/v1/products/${context?.params?.id}`,
    process.env.NEXT_PUBLIC_DB_URL,
  )
  const res = await fetch(url)

  const product = (await res.json()) as ResponseById<IProduct> | undefined

  if (!product) {
    return {
      notFound: true,
    }
  }

  return {
    props: { product },
  }
}

function DetailProductPage({
  product,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="flex flex-col gap-10">
      <DetailProduct {...product.data} />
      <OtherProduct />
    </div>
  )
}

DetailProductPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}

export default DetailProductPage
