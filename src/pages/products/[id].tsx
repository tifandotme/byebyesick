import React from "react"
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next"
import Head from "next/head"

import type { ApiResponse, IProduct, ResponseById } from "@/types/api"
import { MainLayout } from "@/components/layouts/main"
import DetailProduct from "@/features/drug/component/section/detail-product"
import OtherProduct from "@/features/drug/component/section/other-product"

export const BASE_URL = process.env.DB_URL as string

export const getStaticPaths: GetStaticPaths = async () => {
  const url = BASE_URL + "/v1/products"
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
  const url = BASE_URL + `/v1/products/${context?.params?.id}`
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
    <>
      <Head>
        <title>{product.data.name} - ByeByeSick</title>
      </Head>
      <div className="flex flex-col gap-10">
        <DetailProduct {...product.data} />
        <OtherProduct />
      </div>
    </>
  )
}

DetailProductPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}

export default DetailProductPage
