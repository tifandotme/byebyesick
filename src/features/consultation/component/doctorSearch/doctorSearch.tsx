import { useRouter } from "next/router"
import { ArrowLeft } from "lucide-react"

import type { doctorI } from "@/types/api"
import { Button } from "@/components/ui/button"
import { DoctorCard } from "@/features/consultation/components/doctor-card"

function DoctorSearch({
  title,
  DoctorList,
}: {
  title?: string
  DoctorList?: doctorI[]
}) {
  const { back } = useRouter()
  return (
    <div className="flex flex-col gap-5 py-9">
      <div className="flex items-center gap-2">
        <Button
          size={"icon"}
          onClick={() => {
            back()
          }}
          variant={"ghost"}
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-semibold capitalize">{title}</h1>
      </div>
      <div className="grid grid-cols-1 gap-5 px-2  md:grid-cols-2">
        {DoctorList && DoctorList?.length > 0 ? (
          DoctorList.map((doctor) => {
            return <DoctorCard key={doctor.name} {...doctor} />
          })
        ) : (
          <div className="flex w-full font-semibold">No Doctor Available</div>
        )}
      </div>
    </div>
  )
}

export default DoctorSearch
