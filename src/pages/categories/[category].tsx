import React, { useState, type ReactElement } from "react"
import { useRouter } from "next/router"
import { ProductCard } from "@/features/products/components/products-card"

import { useProductData } from "@/lib/fetchers"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import MainLayout from "@/components/layout/mainLayout"
import Loader from "@/components/loader"

export default function CategoriesPage() {
  const router = useRouter()
  const [sortBy, setSortBy] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [drugClass, setDrugClass] = useState<number>()

  const { data, isLoading, mutate } = useProductData({
    sort_by: sortBy,
    page: currentPage,
    drug_class: drugClass,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold">{router.query.category}</h1>
        <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.data.items.map((items) => (
            <div key={items.id}>
              <ProductCard
                product={{
                  data: items,
                }}
              />
            </div>
          ))}
        </div>
        <Pagination className="mt-5">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                isActive
                onClick={() => {
                  setCurrentPage(data?.data.current_page ?? 0 + 1)
                }}
              >
                {data?.data.current_page}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  )
}

CategoriesPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
