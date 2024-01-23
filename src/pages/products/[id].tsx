import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"

import type { IProduct, ResponseById } from "@/types/api"
import { MainLayout } from "@/components/layouts/main"
import DetailProduct from "@/features/drug/component/section/detail-product"

export const BASE_URL = process.env.NEXT_PUBLIC_DB_URL as string

export const getServerSideProps: GetServerSideProps<{
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
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
