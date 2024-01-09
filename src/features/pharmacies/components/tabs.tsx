import { useRouter } from "next/router"

import { DashboardTabs } from "@/components/dashboard-tabs"

export function PharmaciesTabs() {
  const router = useRouter()

  const { id, productId } = router.query

  return (
    <DashboardTabs
      tabs={[
        {
          title: "Pharmacy",
          href: `/dashboard/pharmacies/${id}`,
          additionalHrefs: [`/dashboard/pharmacies/${id}/edit`],
        },
        {
          title: "Products",
          href: `/dashboard/pharmacies/${id}/products`,
          additionalHrefs: [
            `/dashboard/pharmacies/${id}/products/add`,
            `/dashboard/pharmacies/${id}/products/${productId}/edit`,
          ],
        },
        {
          title: "Journal",
          href: `/dashboard/pharmacies/${id}/journal`,
        },
      ]}
    />
  )
}
