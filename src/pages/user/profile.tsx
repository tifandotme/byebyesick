import React from "react"
import Head from "next/head"

import MainLayout from "@/components/layout/mainLayout"
import ProfileForm from "@/features/profile/components/form/profileForm"
import ProfileLayout from "@/features/profile/components/layout/profileLayout"
import ResetPassword from "@/features/profile/components/resetPassword/resetPassword"

function ProfilePage() {
  return (
    <ProfileLayout title="Profile" desc="User Profile Management">
      <Head>
        <title>ByeByeSick | Profile</title>
      </Head>
      <ProfileForm />
      <ResetPassword />
    </ProfileLayout>
  )
}

ProfilePage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}

export default ProfilePage
