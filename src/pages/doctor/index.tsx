import React from "react"

import { HomePageHero } from "@/components/homepage-hero"
import { HomeLayout } from "@/components/layouts/home"
import { ChatList } from "@/features/consultation/components/chat-list"
import { OnlineToggleButton } from "@/features/doctor/components/online-toggle-button"

export default function DoctorHomePage() {
  return (
    <div className="overflow-hidden">
      <HomePageHero />

      <div className="container relative mb-16 max-w-3xl">
        <OnlineToggleButton className="absolute right-4 top-5 sm:right-14" />
        <ChatList status="ongoing" as="doctor" />
      </div>
    </div>
  )
}

DoctorHomePage.getLayout = function getLayout(page: React.ReactElement) {
  return <HomeLayout>{page}</HomeLayout>
}
