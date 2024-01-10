import { useRouter } from "next/router"
import { PlusIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { PharmacySwitcher } from "@/features/pharmacies/components/pharmacy-switcher"

export function PharmaciesLayout({ children }: React.PropsWithChildren) {
  const router = useRouter()

  const isPharmacyDetailPage = router.route.startsWith(
    "/dashboard/pharmacies/[pharmacyId]",
  )
  const isPharmacyListPage = router.route === "/dashboard/pharmacies"

  return (
    <section className="grid items-center gap-8 pb-8 pt-6 md:py-8">
      <PageHeader className="relative">
        <PageHeaderHeading size="sm">
          {isPharmacyDetailPage ? "Dashboard" : "Pharmacies"}
        </PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage my pharmacies
        </PageHeaderDescription>
        <div className="absolute right-1 top-3.5">
          {isPharmacyDetailPage && <PharmacySwitcher />}
          {isPharmacyListPage && (
            <Button
              size="sm"
              onClick={() => router.push("/dashboard/pharmacies/add")}
            >
              <PlusIcon className="mr-1.5" /> Create pharmacy
            </Button>
          )}
        </div>
      </PageHeader>

      {children}
    </section>
  )
}
