import React from "react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
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
        <PaginationItem>
          <PaginationPrevious
            className="cursor-pointer"
            onClick={() => {
              setCurrentPage(page - 1)
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive>{page}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            className="cursor-pointer"
            onClick={() => {
              setCurrentPage(page + 1)
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
