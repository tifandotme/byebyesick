import { useRouter } from "next/router"
import { Pencil1Icon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

export function PharmaciesLayout({ children }: React.PropsWithChildren) {
  const router = useRouter()

  return (
    <section className="grid items-center gap-8 pb-8 pt-6 md:py-8">
      <PageHeader separated className="relative">
        <PageHeaderHeading size="sm">Pharmacies</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage pharmacies
        </PageHeaderDescription>
        {router.pathname === "/dashboard/posts" && (
          <div className="absolute right-1 top-3.5">
            <Button
              size="sm"
              onClick={() => router.push("/dashboard/posts/add")}
            >
              <Pencil1Icon className="mr-2" /> Create pharmacy
            </Button>
          </div>
        )}
      </PageHeader>

      {children}
    </section>
  )
}
