// PaginationComponent.tsx

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
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

const PaginationComponent: React.FC<PaginationComponentProps> = ({
  currentPage,
  setCurrentPage,
}) => (
  <Pagination className="mb-3 mt-5">
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious href="#" />
      </PaginationItem>
      <PaginationItem>
        <PaginationLink
          isActive
          onClick={() => {
            setCurrentPage(currentPage + 1)
          }}
        >
          {currentPage}
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
)

export default PaginationComponent
