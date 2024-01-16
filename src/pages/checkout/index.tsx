import React, { type ReactElement } from "react"
import { useRouter } from "next/router"

import MainLayout from "@/components/layout/main-layout"

export default function CheckoutPage() {
  const router = useRouter()

  const ids =
    typeof router.query.ids === "string"
      ? decodeURIComponent(router.query.ids).split(",")
      : []
  console.log(ids)
  return (
    <>
      <div>Checkout Page</div>
    </>
  )
}

CheckoutPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
