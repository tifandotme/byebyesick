import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/layouts/dashboard"
import { UserForm } from "@/features/users/components/form"
import { UsersLayout } from "@/features/users/components/layout"

export default function AddUserPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Add user</CardTitle>
      </CardHeader>
      <CardContent>
        <UserForm mode="add" />
      </CardContent>
    </Card>
  )
}

AddUserPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <UsersLayout>{page}</UsersLayout>
    </DashboardLayout>
  )
}
