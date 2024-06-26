import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Head from "next/head"

import type { ResponseGetAll, Specialization } from "@/types/api"
import { useDoctorList } from "@/lib/fetchers"
import { unslugify } from "@/lib/utils"
import ChartLoader from "@/components/chart/chartLoader"
import { MainLayout } from "@/components/layouts/main"
import DoctorSearch from "@/features/consultation/component/doctorSearch/doctorSearch"
import PaginationComponent from "@/features/products/components/pagination-product"

export const getServerSideProps: GetServerSideProps<{
  category: Specialization[]
}> = async (context) => {
  const slug = context.params?.slug as string
  const url = process.env.NEXT_PUBLIC_DB_URL + `/v1/doctor-specs`
  const res = await fetch(url)
  const decoded: ResponseGetAll<Specialization[]> = await res.json()
  const items = decoded.data.items
  const category = items.filter(
    (value) => value.name.toLowerCase() === unslugify(slug).toLowerCase(),
  )

  if (category.length === 0) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      category,
    },
  }
}

function DoctorsByCategoryPage({
  category,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [page, setPage] = React.useState(1)
  const limit = 10
  const { doctorIsLoading, doctorList } = useDoctorList(
    category[0]?.name,
    page,
    limit.toString(),
  )

  return (
    <div className="flex h-full min-h-full justify-center gap-10">
      <div className="w-full max-w-5xl">
        <Head>
          <title>ByeByeSick | {category[0]?.name}</title>
        </Head>
        <div className="w-full">
          {doctorIsLoading ? (
            <ChartLoader />
          ) : (
            category && (
              <>
                <DoctorSearch
                  title={category[0]?.name}
                  DoctorList={doctorList?.data.items}
                />
                {doctorList && doctorList?.data.total_items > limit && (
                  <PaginationComponent page={page} setCurrentPage={setPage} />
                )}
              </>
            )
          )}
        </div>
      </div>
    </div>
  )
}
DoctorsByCategoryPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
export default DoctorsByCategoryPage
