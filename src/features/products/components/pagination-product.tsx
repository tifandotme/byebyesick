import React from "react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationComponentProps {
  page: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

export default function PaginationComponent({
  page,
  setCurrentPage,
}: PaginationComponentProps) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationPrevious
          className="cursor-pointer"
          onClick={() => {
            setCurrentPage(page - 1)
          }}
        />
        <PaginationLink isActive>{page}</PaginationLink>
        <PaginationEllipsis />

        <PaginationNext
          className="cursor-pointer"
          onClick={() => {
            setCurrentPage(page + 1)
          }}
        />
      </PaginationContent>
    </Pagination>
  )
}
