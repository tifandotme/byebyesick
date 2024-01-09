import { useRouter } from "next/router"

import { DashboardTabs } from "@/components/dashboard-tabs"

export function PharmaciesTabs() {
  const router = useRouter()

  const { pharmacyId, productId } = router.query as Record<string, string>

  return (
    <DashboardTabs
      tabs={[
        {
          title: "Pharmacy",
          href: `/dashboard/pharmacies/${pharmacyId}`,
          additionalHrefs: [`/dashboard/pharmacies/${pharmacyId}/edit`],
        },
        {
          title: "Products",
          href: `/dashboard/pharmacies/${pharmacyId}/products`,
          additionalHrefs: [
            `/dashboard/pharmacies/${pharmacyId}/products/add`,
            `/dashboard/pharmacies/${pharmacyId}/products/${productId}/edit`,
          ],
        },
        {
          title: "Journal",
          href: `/dashboard/pharmacies/${pharmacyId}/journal`,
        },
      ]}
    />
  )
}
