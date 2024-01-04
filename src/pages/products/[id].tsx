import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"

import type { IProduct, ResponseById } from "@/types/api"
import MainLayout from "@/components/layout/mainLayout"
import DetailProduct from "@/features/drug/component/section/detailProduct"
import OtherProduct from "@/features/drug/component/section/otherProduct"

interface PageProps {
  props: ResponseById<IProduct>
}

export const getServerSideProps = (async (context) => {
  const id = context?.params?.id
  const product = await fetch(
    `https://byebyesick-staging.irfancen.com/v1/products/${id}`,
  )
  if (!product.ok || product.status !== 200) {
    return {
      notFound: true,
    }
  }
  const parsedProduct: ResponseById<IProduct> = await product.json()
  const props = {
    props: parsedProduct,
  }
  return { props }
}) satisfies GetServerSideProps<PageProps>

function DetailProductPage({
  props,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex flex-col gap-10">
      <DetailProduct {...props.data} />
      <OtherProduct />
    </div>
  )
}

DetailProductPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}

export default DetailProductPage
