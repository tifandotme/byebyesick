import React from "react"

import type { Specialization } from "@/types/api"
import { CategoryCard } from "@/features/landing/component/categories/category-card"

function DoctorCategory({ category }: { category: Specialization[] }) {
  return (
    <div className="w-full">
      <h1 className="mb-3 text-3xl font-bold text-primary">
        Doctor Categories
      </h1>
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
    </div>
  )
}

export default DoctorCategory
