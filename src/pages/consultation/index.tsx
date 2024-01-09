import React from "react"
import Head from "next/head"

import MainLayout from "@/components/layout/mainLayout"
import DoctorCategory from "@/features/consultation/component/doctorCategory/doctorCategory"
import DoctorRecomendation from "@/features/consultation/component/doctorRecomendation/doctorRecomendation"

function DoctorListPage() {
  return (
    <div className="flex flex-col gap-5">
      <Head>
        <title>ByeByeSick | Consultation</title>
      </Head>
      <DoctorCategory />
      <DoctorRecomendation />
    </div>
  )
}

DoctorListPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
export default DoctorListPage
