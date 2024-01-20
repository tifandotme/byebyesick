import React, { type ReactElement } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { MapPin } from "lucide-react"
import useSWR from "swr"

import {
  type AddressIForm,
  type AddressResponse,
  type CheckoutResponse,
  type ICheckout,
} from "@/types/api"
import { groupBy } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckoutCard } from "@/components/checkout/checkout-card"
import MainLayout from "@/components/layout/main-layout"

export default function CheckoutPage() {
  const router = useRouter()
  const { isReady, query } = router

  const address = isReady ? query.address : null

  const ids =
    isReady && typeof query.ids === "string"
      ? decodeURIComponent(query.ids).split(",")
      : []

  const { data: selectedAddress } = useSWR<AddressResponse<AddressIForm>>(
    `/v1/profile/addresses/${address}`,
  )

  const { data: checkoutItems } = useSWR<CheckoutResponse<ICheckout[]>>(
    `/v1/cart-items/checkout?cart_item_ids=${ids}&latitude=${selectedAddress?.data.latitude}&longitude=${selectedAddress?.data.longitude}`,
  )

  React.useEffect(() => {
    if (isReady && !address) {
      router.push("/cart")
    }
  }, [address, router, isReady])

  function groupByPharmacyId(items: ICheckout[]) {
    return items.reduce(
      (acc, item) => {
        const key = item.pharmacy_product.pharmacy_id
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key]!.push(item)
        return acc
      },
      {} as Record<number, ICheckout[]>,
    )
  }
  const groupedItems = groupByPharmacyId(checkoutItems?.items || [])

  return (
    <>
      <Head>
        <title>Checkout</title>
      </Head>
      <h2 className="py-6 text-2xl font-bold">Checkout Page</h2>
      <Card className="mb-3 w-full ">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground md:text-xl">
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <div className="flex space-x-1 ">
              <MapPin className="mr-2 " />
              {selectedAddress?.data.name}
            </div>
            <p className="mt-2 truncate text-sm md:mt-3 md:text-base">
              {selectedAddress?.data.address}
            </p>
            <p className="truncate text-sm md:mt-0 md:text-base">
              {selectedAddress?.data.sub_district},{" "}
              {selectedAddress?.data.district},{" "}
              {selectedAddress?.data.postal_code}
            </p>
          </div>
        </CardContent>
      </Card>
      {Object.entries(groupedItems).map(([pharmacyId, items]) => (
        <div key={pharmacyId}>
          <h2>Pharmacy ID: {pharmacyId}</h2>
          {items.map((item) => (
            <CheckoutCard key={item.id} item={item} />
          ))}
        </div>
      ))}
    </>
  )
}

CheckoutPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
