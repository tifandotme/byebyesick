import React from "react"
import ProductLayout from "@/features/products/components/layout"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProductCategoriesForm from "@/components/forms/product-categories-form"
import { DashboardLayout } from "@/components/layouts/dashboard"

export default function AddProductCategoriesPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Add Products Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductCategoriesForm mode="add" />
      </CardContent>
    </Card>
  )
}

AddProductCategoriesPage.getLayout = function getLayout(
  page: React.ReactElement,
) {
  return (
    <DashboardLayout>
      <ProductLayout>{page}</ProductLayout>
    </DashboardLayout>
  )
}
