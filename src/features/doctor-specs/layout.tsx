import React from "react"
import { useRouter } from "next/router"
import { PlusIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

export default function DoctorSpecsLayout({
  children,
}: React.PropsWithChildren) {
  const router = useRouter()

  return (
    <section className="grid items-center gap-8 pb-8 pt-6 md:py-8">
      <PageHeader separated className="block md:relative">
        <PageHeaderHeading size="sm">Doctor Specialization</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your Doctor Specialization
        </PageHeaderDescription>
        {router.pathname === "/dashboard/doctor-specs" && (
          <div className="right-1 top-3.5 mt-2 block md:absolute md:mt-0">
            <Button
              size="sm"
              onClick={() => router.push("/dashboard/doctor-specs/add")}
            >
              <PlusIcon className="mr-2" /> Create Doctor Specialization
            </Button>
          </div>
        )}
      </PageHeader>

      {children}
    </section>
  )
}
