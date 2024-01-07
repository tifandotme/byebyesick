import React from "react"

import MainLayout from "@/components/layout/mainLayout"
import ProfileLayout from "@/features/profile/components/layout/profileLayout"

function AddressPage() {
  return (
    <ProfileLayout title="My Address" desc="User Address Management">
      <div>AddressPage</div>
    </ProfileLayout>
  )
}

AddressPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}

export default AddressPage
