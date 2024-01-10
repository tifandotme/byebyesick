import React, { type ReactElement } from "react"

import MainLayout from "@/components/layout/main-layout"

export default function CartPage() {
  return (
    <>
      <div>
        <h1>Cart Page</h1>
      </div>
    </>
  )
}
CartPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
