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

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  page,
  setCurrentPage,
}) => (
  <Pagination className="mb-3 mt-5">
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
        <PaginationLink
          isActive
          onClick={() => {
            setCurrentPage(page + 1)
          }}
        >
          {page}
        </PaginationLink>
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

export default PaginationComponent
