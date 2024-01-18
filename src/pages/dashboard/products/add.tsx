import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProductForm from "@/components/forms/products-forms"
import { DashboardLayout } from "@/components/layouts/dashboard"
import ProductLayout from "@/features/products/components/layout"

export default function AddPostPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Add Products</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductForm mode="add" />
      </CardContent>
    </Card>
  )
}

AddPostPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <ProductLayout>{page}</ProductLayout>
    </DashboardLayout>
  )
}
