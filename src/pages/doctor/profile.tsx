import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"
import { getSession } from "next-auth/react"

import type { IProfileDoctor, ResponseById } from "@/types/api"
import { MainLayout } from "@/components/layouts/main"
import { getDoctorProfile } from "@/features/profile/api/getDoctorProfile"
import DoctorProfileForm from "@/features/profile/components/form/doctorProfileForm"
import ProfileLayout from "@/features/profile/components/layout/profileLayout"
import ResetPassword from "@/features/profile/components/resetPassword/resetPassword"

export const getServerSideProps: GetServerSideProps<{
  userProfile: ResponseById<IProfileDoctor>
}> = async (context) => {
  const session = await getSession(context)
  if (session) {
    const resp = await getDoctorProfile(session.user.token)
    const userProfile = await resp.json()
    return {
      props: {
        userProfile,
      },
    }
  }
  return {
    notFound: true,
  }
}

function DoctorProfilePage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  return (
    <div className="py-7">
      <ProfileLayout title="Profile" desc="User Profile Management">
        <Head>
          <title>ByeByeSick | Doctor Profile</title>
        </Head>
        <DoctorProfileForm userProfile={props.userProfile.data} />
        <ResetPassword {...props.userProfile.data} />
      </ProfileLayout>
    </div>
  )
}

DoctorProfilePage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}

export default DoctorProfilePage
