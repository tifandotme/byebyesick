import React from "react"
import { useRouter } from "next/router"
import { Pencil1Icon, PlusIcon } from "@radix-ui/react-icons"
import { PlusCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

export default function ManufacturerLayout({
  children,
}: React.PropsWithChildren) {
  const router = useRouter()

  return (
    <section className="grid items-center gap-8 pb-8 pt-6 md:py-8">
      <PageHeader separated className="block md:relative">
        <PageHeaderHeading size="sm">Manufacturers</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your manufacturers
        </PageHeaderDescription>
        {router.pathname === "/dashboard/manufacturers" && (
          <div className="right-1 top-3.5 mt-2 block md:absolute md:mt-0">
            <Button
              size="sm"
              onClick={() => router.push("/dashboard/manufacturers/add")}
            >
              <PlusIcon className="mr-2" /> Create Manufacturers
            </Button>
          </div>
        )}
      </PageHeader>

      {children}
    </section>
  )
}
