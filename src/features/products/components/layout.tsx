import React from "react"
import { useRouter } from "next/router"
import { Pencil1Icon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

export default function ProductLayout({ children }: React.PropsWithChildren) {
  const router = useRouter()

  return (
    <section className="grid items-center gap-8 pb-8 pt-6 md:py-8">
      <PageHeader separated className="block md:relative">
        <PageHeaderHeading size="sm">Products</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your products
        </PageHeaderDescription>
        {router.pathname === "/dashboard/products" && (
          <div className="right-1 top-3.5 mt-2 block md:absolute md:mt-0">
            <Button
              size="sm"
              onClick={() => router.push("/dashboard/products/add")}
            >
              <Pencil1Icon className="mr-2" /> Create new products
            </Button>
          </div>
        )}
      </PageHeader>

      {children}
    </section>
  )
}
