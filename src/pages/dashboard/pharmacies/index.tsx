import React from "react"
import { PharmaciesLayout } from "@/features/pharmacies/components/layout"

import { DashboardLayout } from "@/components/layouts/dashboard"

export default function PostsPage() {
  // const { data, isLoading } = useSWR("/posts?_sort=createdAt&_order=desc")

  return (
    <div className="space-y-6 overflow-auto">
      <>test</>
      {/* {isLoading && <DataTableSkeleton columnCount={5} />}
      {!isLoading && data && <PostsTable data={data} />} */}
    </div>
  )
}

PostsPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <DashboardLayout>
      <PharmaciesLayout>{page}</PharmaciesLayout>
    </DashboardLayout>
  )
}
