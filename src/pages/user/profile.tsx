import React, { useEffect } from "react"
import Head from "next/head"
import { useSession } from "next-auth/react"

import MainLayout from "@/components/layout/main-layout"
import { getUserProfile } from "@/features/profile/api/getUserProfile"
import ProfileForm from "@/features/profile/components/form/profileForm"
import ProfileLayout from "@/features/profile/components/layout/profileLayout"
import ResetPassword from "@/features/profile/components/resetPassword/resetPassword"

function ProfilePage() {
  const { data: session, status } = useSession()

  useEffect(() => {
    const getProfile = async () => {
      const data = await getUserProfile(session?.user.token)
      return data
    }
    if (status === "authenticated") console.log(getProfile())
  }, [status])
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
