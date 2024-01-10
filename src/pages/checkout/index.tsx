import React, { type ReactElement } from "react"

import MainLayout from "@/components/layout/mainLayout"

export default function CheckoutPage() {
  return (
    <>
      <div></div>
    </>
  )
}

CheckoutPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
