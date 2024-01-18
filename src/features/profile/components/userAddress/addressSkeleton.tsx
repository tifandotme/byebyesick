import React from "react"

import { Skeleton } from "@/components/ui/skeleton"

function AddressSkeleton() {
  return (
    <div className="flex w-full flex-row items-center justify-between">
      <div className="flex flex-col gap-2">
        <Skeleton />
        <Skeleton />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton />
      </div>
    </div>
  )
}

export default AddressSkeleton
