import React from "react"

import { CategoryCard } from "@/features/landing/component/categories/category-card"

function DoctorCategory() {
  return (
    <>
      <h1 className="text-2xl font-semibold text-primary">Doctor Categories</h1>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        <CategoryCard
          link="/constultation/categories"
          category="Dokter Kandungan"
          background="https://www.saarmagazine.nl/wp-content/uploads/2017/07/dokter-.jpg"
        />
        <CategoryCard
          link="/constultation/categories"
          category="Dokter Anak"
          background="https://www.saarmagazine.nl/wp-content/uploads/2017/07/dokter-.jpg"
        />
        <CategoryCard
          link="/constultation/categories"
          category="Dokter THT"
          background="https://www.saarmagazine.nl/wp-content/uploads/2017/07/dokter-.jpg"
        />
        <CategoryCard
          link="/constultation/categories"
          category="Dokter Mata"
          background="https://www.saarmagazine.nl/wp-content/uploads/2017/07/dokter-.jpg"
        />
      </div>
    </>
  )
}

export default DoctorCategory
