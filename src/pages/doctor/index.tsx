import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { getSession } from "next-auth/react"

import type { IProfileDoctor, ResponseById } from "@/types/api"
import { HomePageHero } from "@/components/homepage-hero"
import { HomeLayout } from "@/components/layouts/home"
import { ChatList } from "@/features/consultation/components/chat-list"
import { SetOnlineButton } from "@/features/doctor/components/doctor-profile/doctor-profile"
import { getDoctorProfile } from "@/features/profile/api/getDoctorProfile"

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

export default function DoctorHomePage({
  userProfile,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="overflow-hidden">
      <HomePageHero />

      <div className="container relative mb-16 max-w-3xl">
        <SetOnlineButton
          doctor={userProfile.data}
          className="absolute right-4 top-5 sm:right-14"
        />
        <ChatList status="ongoing" as="doctor" />
      </div>
    </div>
  )
}

DoctorHomePage.getLayout = function getLayout(page: React.ReactElement) {
  return <HomeLayout>{page}</HomeLayout>
}
