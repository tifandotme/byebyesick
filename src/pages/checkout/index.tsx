import React, { type ReactElement } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { MapPin } from "lucide-react"
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
import { createTransactions, getShippingMethods } from "@/lib/fetchers"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckoutCard } from "@/components/checkout/checkout-card"
import { MainLayout } from "@/components/layouts/main"

export default function CheckoutPage() {
  const router = useRouter()
  const { isReady, query } = router

  const [loadingShippingMethods, setLoadingShippingMethods] =
    React.useState(false)
  const [selectedShippingMethods, setSelectedShippingMethods] = React.useState<
    Record<number, IShippingMethod>
  >({})

  const [shippingMethods, setShippingMethods] = React.useState<
    Record<number, ResponseGetAll<IShippingMethod[]>>
  >({})

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
    <div className="flex w-full items-center justify-center">
      <div className="w-full max-w-6xl">
        <Head>
          <title>Checkout | ByeByeSick</title>
        </Head>
        <h2 className="py-6 text-2xl font-bold">Checkout Page</h2>
        <div className="flex flex-col md:flex-row md:space-x-3">
          <div className="md:w-2/3">
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
            {Object.entries(groupedPharmacyProducts).map(
              ([pharmacyId, items]) => (
                <div key={pharmacyId} className="mb-5">
                  <h2 className="text-xl font-semibold text-muted-foreground">
                    Order {pharmacyId}
                  </h2>
                  {!pharmacyId && (
                    <div>
                      {items.map((item) => (
                        <CheckoutCard key={item.id} item={item} />
                      ))}
                    </div>
                  )}

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
                        if (result.data) {
                          setShippingMethods((prev) => ({
                            ...prev,
                            [pharmacyId]: result as unknown as ResponseGetAll<
                              IShippingMethod[]
                            >,
                          }))
                        } else {
                          toast.error("Can't get shipping methods")
                        }
                      }
                    }}
                    onValueChange={(value) => {
                      const selectedMethod = shippingMethods[
                        Number(pharmacyId)
                      ]?.data.items.find((method) => method.name === value)

                      if (selectedMethod) {
                        setSelectedShippingMethods((prev) => ({
                          ...prev,
                          [pharmacyId]: selectedMethod,
                        }))
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
                          <>
                            <Skeleton className="ml-6 mt-3 h-7 w-[150px] animate-pulse lg:w-[250px]" />
                            <Skeleton className="ml-6 mt-3 h-7 w-[150px] animate-pulse lg:w-[250px]" />
                            <Skeleton className="ml-6 mt-3 h-7 w-[150px] animate-pulse lg:w-[250px]" />
                          </>
                        ) : (
                          shippingMethods[Number(pharmacyId)]?.data.items.map(
                            (method) => (
                              <SelectItem key={method.id} value={method.name}>
                                {method.name} - {formatPrice(method.cost)}
                              </SelectItem>
                            ),
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              ),
            )}
          </div>
          <div className="md:w-1/3">
            <Card className="mb-3 w-full">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground md:text-xl">
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <p>Subtotal:</p>
                  <p>
                    {formatPrice(
                      checkoutItems?.items.reduce(
                        (accumulator, item) =>
                          accumulator +
                          item.quantity * Number(item.pharmacy_product.price),
                        0,
                      ) || 0,
                    )}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>Shipping:</p>
                  <p>
                    {formatPrice(
                      Object.values(selectedShippingMethods).reduce(
                        (accumulator, method) =>
                          accumulator + Number(method.cost),
                        0,
                      ) || 0,
                    )}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>Total:</p>
                  <p>
                    {formatPrice(
                      (checkoutItems?.items.reduce(
                        (accumulator, item) =>
                          accumulator +
                          (item.quantity *
                            Number(item.pharmacy_product.price) || 0),
                        0,
                      ) || 0) +
                        (Object.values(selectedShippingMethods).reduce(
                          (accumulator, method) =>
                            accumulator + (Number(method?.cost) || 0),
                          0,
                        ) || 0),
                    )}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => {
                    const totalPayment =
                      (checkoutItems?.items.reduce(
                        (accumulator, item) =>
                          accumulator +
                          item.quantity * Number(item.pharmacy_product.price),
                        0,
                      ) || 0) +
                      (Object.values(selectedShippingMethods).reduce(
                        (accumulator, method) =>
                          accumulator + Number(method.cost),
                        0,
                      ) || 0)

                    const doTransaction = async () => {
                      const response = await createTransactions({
                        address_id: Number(address),
                        total_payment: String(totalPayment),
                        orders: Object.entries(groupedPharmacyProducts).map(
                          ([pharmacyId, items]) => ({
                            shipping_cost: String(
                              selectedShippingMethods[Number(pharmacyId)]?.cost,
                            ),
                            shipping_method_id:
                              selectedShippingMethods[Number(pharmacyId)]?.id!,
                            order_details: items.map((item) => ({
                              pharmacy_product_id: Number(
                                item.pharmacy_product.id,
                              ),
                              quantity: Number(item.quantity),
                            })),
                          }),
                        ),
                      })
                      if (response.success) {
                        const transactionId = response.data?.data.id
                        router.push(
                          `/order/transaction-confirmation/${transactionId}`,
                        )
                      } else {
                        throw new Error(response.message)
                      }
                    }

                    toast.promise(doTransaction(), {
                      success:
                        "Transaction Created, please upload your payment proof",
                      error: "Failed to create Transaction",
                    })
                  }}
                >
                  Pay
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

CheckoutPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
