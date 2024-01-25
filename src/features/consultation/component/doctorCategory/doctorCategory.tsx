import React from "react"

import type { doctorI, Specialization } from "@/types/api"
import { useDoctorList } from "@/lib/fetchers"
import ChartLoader from "@/components/chart/chartLoader"
import { DoctorCard } from "@/features/consultation/components/doctor-card"
import { CategoryCard } from "@/features/landing/component/categories/category-card"
import PaginationComponent from "@/features/products/components/pagination-product"
import Search from "@/features/sales-report/components/search/search"

function DoctorCategory({ category }: { category: Specialization[] }) {
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const limit = 10
  const { doctorIsLoading, doctorList } = useDoctorList(
    search,
    page,
    limit.toString(),
  )
  const doctorListData = doctorList?.data.items
  return (
    <div className="flex w-full flex-col gap-3 px-2 sm:px-4">
      <h2 className="mb-2 text-3xl font-extrabold">Doctor Categories</h2>
      <div className="grid grid-cols-2 gap-3 px-2 md:grid-cols-3 lg:grid-cols-4">
        {category &&
          category.map((cat) => {
            return (
              <CategoryCard
                key={cat.name}
                link="/doctors/categories"
                category={cat.name}
                background={
                  cat.image ||
                  `${process.env.NEXT_PUBLIC_SITE_PATH}/images/dokter_placeholder.jpg`
                }
              />
            )
          })}
      </div>
      <h2 className="mb-2 mt-14 text-3xl font-extrabold">Our Doctor</h2>
      <div className="flex flex-col gap-3">
        <div className="mb-2 max-w-[300px] px-2">
          <Search setValue={setSearch} placeholder="Search Doctor..." />
        </div>
        <div className="grid grid-cols-1 gap-5 px-2 md:grid-cols-2">
          {doctorIsLoading && <ChartLoader />}
          {!doctorIsLoading && doctorListData && doctorListData?.length > 0 ? (
            <>
              {doctorListData.map((doctor: doctorI) => {
                return <DoctorCard key={doctor.name} {...doctor} />
              })}
              {doctorListData.length >= limit && (
                <PaginationComponent page={page} setCurrentPage={setPage} />
              )}
            </>
          ) : (
            <div className="flex justify-center font-semibold">Empty</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorCategory
