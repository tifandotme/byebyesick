import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"

import type { ResponseGetAll, Specialization } from "@/types/api"
import { MainLayout } from "@/components/layouts/main"
import DoctorCategory from "@/features/consultation/component/doctorCategory/doctorCategory"

export const getServerSideProps: GetServerSideProps<{
  category: Specialization[]
}> = async () => {
  const url = process.env.NEXT_PUBLIC_DB_URL + `/v1/doctor-specs`
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
    <div className="flex w-full justify-center py-9">
      <div className="w-full max-w-6xl">
        <Head>
          <title>ByeByeSick | Doctor List</title>
        </Head>
        <DoctorCategory category={category} />
      </div>
    </div>
  )
}

DoctorListPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
export default DoctorListPage
