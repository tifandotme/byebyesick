import React from "react"
import { useRouter } from "next/router"
import { Pencil1Icon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

export default function ProductCategoriesLayout({
  children,
}: React.PropsWithChildren) {
  const router = useRouter()

  return (
    <section className="grid items-center gap-8 pb-8 pt-6 md:py-8">
      <PageHeader separated className="relative">
        <PageHeaderHeading size="sm">Products Categories</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your products categories
        </PageHeaderDescription>
        {router.pathname === "/dashboard/productcategories" && (
          <div className="absolute right-1 top-3.5">
            <Button
              size="sm"
              onClick={() => router.push("/dashboard/productcategories/add")}
            >
              <Pencil1Icon className="mr-2" /> Create new products categories
            </Button>
          </div>
        )}
      </PageHeader>

      {children}
    </section>
  )
}
