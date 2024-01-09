import React from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { PharmacyProductForm } from "@/features/pharmacies/components/forms/pharmacy-product"
import { PharmaciesLayout } from "@/features/pharmacies/components/layout"
import { PharmaciesTabs } from "@/features/pharmacies/components/tabs"

export default function AddPharmacyProductPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Add product</CardTitle>
        <CardDescription>Add a new product to your pharmacy</CardDescription>
      </CardHeader>
      <CardContent>
        <PharmacyProductForm mode="add" />
      </CardContent>
    </Card>
  )
}

AddPharmacyProductPage.getLayout = function getLayout(
  page: React.ReactElement,
) {
  return (
    <DashboardLayout>
      <PharmaciesLayout>
        <PharmaciesTabs />
        {page}
      </PharmaciesLayout>
    </DashboardLayout>
  )
}
