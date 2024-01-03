import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { PharmacyForm } from "@/features/pharmacies/components/form"
import { PharmaciesLayout } from "@/features/pharmacies/components/layout"

export default function AddPharmacyPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Add pharmacy</CardTitle>
      </CardHeader>
      <CardContent>
        <PharmacyForm mode="add" />
      </CardContent>
    </Card>
  )
}

AddPharmacyPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <PharmaciesLayout>{page}</PharmaciesLayout>
    </DashboardLayout>
  )
}
