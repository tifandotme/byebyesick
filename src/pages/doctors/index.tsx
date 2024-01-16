import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"

import type { ResponseGetAll, Specialization } from "@/types/api"
import MainLayout from "@/components/layout/main-layout"
import DoctorCategory from "@/features/consultation/component/doctorCategory/doctorCategory"
import DoctorRecomendation from "@/features/consultation/component/doctorRecomendation/doctorRecomendation"

export const getServerSideProps: GetServerSideProps<{
  category: Specialization[]
}> = async () => {
  const url = new URL(`/v1/doctor-specs`, process.env.NEXT_PUBLIC_DB_URL)
  const res = await fetch(url)
  const decoded: ResponseGetAll<Specialization[]> = await res.json()
  const category = decoded.data.items
  return {
    props: {
      category,
    },
  }
}

function DoctorListPage({
  category,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex flex-col gap-5 py-9">
      <Head>
        <title>ByeByeSick | Consultation</title>
      </Head>
      <DoctorCategory category={category} />
      {/* <DoctorRecomendation /> */}
    </div>
  )
}

DoctorListPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
export default DoctorListPage
