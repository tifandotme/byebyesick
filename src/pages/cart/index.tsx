import React, { type ReactElement } from "react"
import { useRouter } from "next/router"
import { CheckCircle2Icon, MapPin } from "lucide-react"
import { toast } from "sonner"

import { useAddressMain, useAdressList, useCartList } from "@/lib/fetchers"
import { useAddressStore } from "@/lib/stores/address"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { CartLineItems } from "@/components/checkout/cart-items"
import { MainLayout } from "@/components/layouts/main"

export default function CartPage() {
  const { cartdata, cartisLoading } = useCartList()
  const router = useRouter()

  const selectedAddress = useAddressStore((state) => state.selectedAddress)
  const setSelectedAddress = useAddressStore(
    (state) => state.setSelectedAddress,
  )

  const [checkedItems, setCheckedItems] = React.useState<
    Record<string, boolean>
  >({})
  const handleCheckChange = (itemId: string, isChecked: boolean) => {
    setCheckedItems((prevState) => ({ ...prevState, [itemId]: isChecked }))
  }

  const { addressError, addressList } = useAdressList()
  const { addressData } = useAddressMain()

  if (cartisLoading) {
    return <Skeleton />
  }

  if (!cartdata) {
    return <div>No items in cart</div>
  }

  const selectedAddressData = selectedAddress
    ? addressList?.data.items.find((address) => address.id === selectedAddress)
    : addressData?.data

  const totalCheckedItems = Object.values(checkedItems).filter(Boolean).length

  const handleCheckout = async () => {
    const checkedIds = Object.keys(checkedItems).filter(
      (id) => checkedItems[id],
    )

    if (checkedIds.length === 0) {
      toast.warning("Please select at least one item")
      return
    }
    const idsString = checkedIds.join(",")
    const selectedAddressId =
      selectedAddress?.toString() ?? addressData?.data.id.toString()
    if (!selectedAddressId) {
      toast.warning("Please select address")
      return
    }

    router.push(
      `/checkout?ids=${encodeURIComponent(idsString)}&address=${encodeURIComponent(selectedAddressId)}`,
    )
  }
  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full max-w-6xl">
        <h1 className="mt-9 text-2xl font-semibold capitalize ">Cart Page</h1>

        <div className="space-y-2 md:flex md:space-x-2">
          <div className="w-full md:w-3/4 ">
            <Card className="mt-3 w-full ">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground md:text-xl">
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="flex space-x-1 ">
                    <MapPin className="mr-2 " />
                    {selectedAddressData?.name}
                  </div>
                  <p className="mt-2 truncate text-sm md:mt-3 md:text-base">
                    {selectedAddressData?.address}
                  </p>
                  <p className="truncate text-sm md:mt-0 md:text-base">
                    {selectedAddressData?.sub_district},{" "}
                    {selectedAddressData?.district},{" "}
                    {selectedAddressData?.postal_code}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant={"outline"} size={"sm"}>
                      Change Address
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="">
                    <DialogHeader>
                      <DialogTitle>Address List</DialogTitle>
                      <DialogDescription className="space-y-6">
                        <span>Change Address here</span>
                        <Button
                          className="w-full border-primary"
                          size={"sm"}
                          variant={"outline"}
                          onClick={() => {
                            router.push("/user/address")
                          }}
                        >
                          Add New Address
                        </Button>
                      </DialogDescription>
                    </DialogHeader>
                    <>
                      {addressError && (
                        <div>
                          <p>Something went wrong</p>
                        </div>
                      )}
                      {addressList?.data.items.map((address) => (
                        <div key={address.id}>
                          <div className="mr-auto flex items-center justify-between ">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <h2 className="text-sm md:text-base">
                                  {address.name}{" "}
                                  {address?.status == 1 ? (
                                    <Badge className="ml-1 bg-apple-600">
                                      Main Address
                                    </Badge>
                                  ) : (
                                    <></>
                                  )}
                                </h2>
                              </div>
                              <div className="max-w-44 text-xs text-muted-foreground md:max-w-96 md:text-sm">
                                {address.address}
                              </div>
                            </div>
                            {address.id === selectedAddress && (
                              <CheckCircle2Icon className="text-apple-600" />
                            )}

                            {address.id !== selectedAddress && (
                              <Button
                                variant={"default"}
                                type="button"
                                size={"sm"}
                                onClick={() => {
                                  setSelectedAddress(address.id)
                                }}
                              >
                                Choose
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
            <div className="mb-3">
              <CartLineItems
                items={cartdata}
                className="mt-5"
                isCheckable={true}
                onChecked={handleCheckChange}
                checkedItems={checkedItems}
              />
            </div>
          </div>

          <div className="">
            <Card className="mt-1 w-auto">
              <CardHeader>
                <CardTitle className="text-xl">Payment Summary</CardTitle>
                <CardDescription className="text-sm">
                  Your summary payment here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <p>
                    <span>Total Items: </span>
                    <span>{checkedItems && totalCheckedItems}</span>
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleCheckout} className="w-full">
                  Buy
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
CartPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
