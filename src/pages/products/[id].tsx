import React from "react"
import DetailProduct from "@/features/drug/component/section/detailProduct"

import MainLayout from "@/components/layout/mainLayout"

function DetailProductPage() {
  return (
    <>
      <DetailProduct />
    </>
  )
}

DetailProductPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}

export default DetailProductPage
