import React from "react"
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next"
import Head from "next/head"

import type { IProduct, ResponseById, ResponseGetAll } from "@/types/api"
import MainLayout from "@/components/layout/main-layout"
import DetailProduct from "@/features/drug/component/section/detail-product"

export const getStaticPaths: GetStaticPaths = async () => {
  const url = new URL("/v1/products", process.env.NEXT_PUBLIC_DB_URL)
  const res = await fetch(url)

  const products: ResponseGetAll<IProduct[]> = await res.json()

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
    <>
      <Head>
        <title>{product.data.name} - ByeByeSick</title>
      </Head>
      <div className="flex flex-col gap-10">
        <DetailProduct {...product.data} />
      </div>
    </>
  )
}

DetailProductPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}

export default DetailProductPage
