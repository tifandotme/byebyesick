import React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ManufacturersForm from "@/components/forms/manufacturers-form"
import ProductForm from "@/components/forms/products-forms"
import { DashboardLayout } from "@/components/layouts/dashboard"
import ManufacturerLayout from "@/features/manufacturers/layout"

export default function AddManufacturersPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Add Manufacturer</CardTitle>
      </CardHeader>
      <CardContent>
        <ManufacturersForm mode="add" />
      </CardContent>
    </Card>
  )
}

AddManufacturersPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <ManufacturerLayout>{page}</ManufacturerLayout>
    </DashboardLayout>
  )
}
