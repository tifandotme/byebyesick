import React, { useState, type ReactElement } from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { useRouter } from "next/router"

import { useProductData } from "@/lib/fetchers"
import { unslugify } from "@/lib/utils"
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
import { ProductCard } from "@/features/products/components/products-card"

export const categories = {
  "obat-bebas": 1,
  "obat-keras": 2,
  "obat-bebas-terbatas": 3,
  "non-obat": 4,
}
export const getServerSideProps: GetServerSideProps<{
  category: keyof typeof categories
}> = async (context) => {
  const category = context.params?.category as
    | keyof typeof categories
    | undefined

  if (!category) {
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

export default function CategoriesPage({
  category,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const [sortBy, setSortBy] = useState<"asc" | "desc">("desc")
  const [, setCurrentPage] = useState<number>(1)

  const { data, error, isLoading } = useProductData({
    drug_class: categories[category],
    limit: 8,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <p>Error</p>{" "}
      </div>
    )
  }

  const categoryTitle =
    typeof router.query?.category === "string"
      ? unslugify(router.query.category)
      : ""

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold capitalize">{categoryTitle}</h1>
        <div>
          {data?.data.current_page_total_items == 0 ? (
            <div className="flex items-center justify-center">
              No product yet
            </div>
          ) : (
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
          )}
        </div>
        {data?.data.current_page_total_items == 0 ? (
          <></>
        ) : (
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
        )}
      </div>
    </>
  )
}

CategoriesPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
