import React from "react"

import type { doctorI, Specialization } from "@/types/api"
import { useDoctorList } from "@/lib/fetchers"
import ChartLoader from "@/components/chart/chartLoader"
import { CategoryCard } from "@/features/landing/component/categories/category-card"
import Search from "@/features/sales-report/components/search/search"

import DoctorCard from "../doctorCard/doctorCard"

function DoctorCategory({ category }: { category: Specialization[] }) {
  const [search, setSearch] = React.useState("")
  const { doctorIsLoading, doctorList } = useDoctorList(search)

  const doctorListData = doctorList?.data.items
  return (
    <div className="flex w-full flex-col gap-3">
      <h1 className="text-3xl font-bold text-primary">Doctor Categories</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {category &&
          category.map((cat) => {
            return (
              <CategoryCard
                key={cat.name}
                link="/doctors/categories"
                category={cat.name}
                background={
                  cat.image ||
                  "https://www.saarmagazine.nl/wp-content/uploads/2017/07/dokter-.jpg"
                }
              />
            )
          })}
      </div>
      <h1 className=" text-3xl font-bold text-primary">Our Doctor</h1>
      <div className="flex flex-col gap-3">
        <div className="mb-3 w-1/3">
          <Search setValue={setSearch} placeholder="Search Doctor..." />
        </div>
        <div className="grid grid-cols-1 gap-5 px-2  md:grid-cols-2">
          {doctorIsLoading && <ChartLoader />}
          {!doctorIsLoading && doctorListData && doctorListData?.length > 0 ? (
            doctorListData.map((doctor: doctorI) => {
              return <DoctorCard key={doctor.name} {...doctor} />
            })
          ) : (
            <>Empty</>
          )}
        </div>
      </div>
    </div>
  )
}

export default DoctorCategory
