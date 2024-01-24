import React from "react"

import { MainLayout } from "@/components/layouts/main"
import { ChatList } from "@/features/consultation/components/chat-list"

export default function DoctorConsultationPage() {
  return (
    <div className="container max-w-4xl p-10">
      <div className="space-y-6">
        <h2 className="mb-5 text-3xl font-extrabold">Consultation</h2>
      </div>
      <ChatList status="ongoing" as="doctor" />
      <ChatList status="ended" as="doctor" />
    </div>
  )
}

DoctorConsultationPage.getLayout = function getLayout(
  page: React.ReactElement,
) {
  return <MainLayout>{page}</MainLayout>
}
