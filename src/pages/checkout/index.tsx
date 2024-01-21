import React, { type ReactElement } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { Loader2, MapPin } from "lucide-react"
import { toast } from "sonner"
import useSWR from "swr"

import {
  type AddressIForm,
  type AddressResponse,
  type CheckoutResponse,
  type ICheckout,
  type IShippingMethod,
  type ResponseGetAll,
} from "@/types/api"
import { getShippingMethods } from "@/lib/fetchers"
import { formatPrice } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckoutCard } from "@/components/checkout/checkout-card"
import MainLayout from "@/components/layout/main-layout"

export default function CheckoutPage() {
  const router = useRouter()
  const { isReady, query } = router

  const [shippingMethods, setShippingMethods] =
    React.useState<ResponseGetAll<IShippingMethod[]>>()
  const [loadingShippingMethods, setLoadingShippingMethods] =
    React.useState(false)
  const address = isReady ? query.address : null

  const ids =
    isReady && typeof query.ids === "string"
      ? decodeURIComponent(query.ids).split(",")
      : []

  const { data: selectedAddress } = useSWR<AddressResponse<AddressIForm>>(
    `/v1/profile/addresses/${address}`,
  )

  const { data: checkoutItems } = useSWR<CheckoutResponse<ICheckout[]>>(
    selectedAddress?.data
      ? `/v1/cart-items/checkout?cart_item_ids=${ids}&latitude=${selectedAddress.data.latitude}&longitude=${selectedAddress.data.longitude}`
      : null,
  )

  React.useEffect(() => {
    if (isReady && !address) {
      router.push("/cart")
    }
  }, [address, router, isReady])

  function groupingPharmacyId(items: ICheckout[]) {
    return items.reduce(
      (accumulator, item) => {
        const accessorKey = item.pharmacy_product.pharmacy_id
        accumulator[accessorKey] = accumulator[accessorKey] || []
        accumulator[accessorKey]!.push(item)
        return accumulator
      },
      {} as Record<number, ICheckout[]>,
    )
  }
  const groupedPharmacyProducts = groupingPharmacyId(checkoutItems?.items || [])

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
      {Object.entries(groupedPharmacyProducts).map(([pharmacyId, items]) => (
        <div key={pharmacyId} className="mb-5">
          <h2>Pharmacy ID: {pharmacyId}</h2>
          {items.map((item) => (
            <CheckoutCard key={item.id} item={item} />
          ))}
          <Select
            onOpenChange={async (open) => {
              if (open) {
                setLoadingShippingMethods(true)
                const result = await getShippingMethods({
                  address_id: Number(address),
                  checkout_items: items.map((item) => ({
                    pharmacy_product_id: item.pharmacy_product.id,
                    quantity: item.quantity,
                  })),
                })
                setLoadingShippingMethods(false)
                if (!result.data) {
                  toast.error("Failed to get shipping methods")
                } else {
                  setShippingMethods(
                    result as unknown as ResponseGetAll<IShippingMethod[]>,
                  )
                }
              }
            }}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Choose Shipping Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Shipping Methods</SelectLabel>
                {loadingShippingMethods ? (
                  <Loader2 className="ml-6 animate-spin" />
                ) : (
                  shippingMethods?.data.items.map((method) => (
                    <SelectItem key={method.id} value={method.name}>
                      {method.name} - {formatPrice(method.cost)}
                    </SelectItem>
                  ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      ))}
    </>
  )
}

CheckoutPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
