import React from "react"

import DoctorCard from "@/features/consultation/component/doctorCard/doctorCard"

function DoctorRecomendation() {
  return (
    <>
      <h2 className="text-2xl font-semibold text-primary">
        Doctor Recomendation
      </h2>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <DoctorCard
          image="https://www.saarmagazine.nl/wp-content/uploads/2017/07/dokter-.jpg"
          name="Doctor Wasik"
          spesialization="Ahli Gizi Buruk"
        />
      </div>
    </>
  )
}

export default DoctorRecomendation
