import React, { type ReactElement } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { MapPin } from "lucide-react"
import useSWR from "swr"

import type { AddressIForm, ResponseGetAll } from "@/types/api"
import { useAddressMain, useCartList } from "@/lib/fetchers"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { CartLineItems } from "@/components/checkout/cart-items"
import MainLayout from "@/components/layout/main-layout"

export default function CartPage() {
  const { cartdata, cartisLoading } = useCartList()
  const router = useRouter()

  const [checkedItems, setCheckedItems] = React.useState<
    Record<string, boolean>
  >({})
  const handleCheckChange = (itemId: string, isChecked: boolean) => {
    setCheckedItems((prevState) => ({ ...prevState, [itemId]: isChecked }))
  }

  const handleCheckout = () => {
    const checkedIds = Object.keys(checkedItems).filter(
      (id) => checkedItems[id],
    )
    const idsString = checkedIds.join(",")
    router.push(`/checkout?ids=${encodeURIComponent(idsString)}`)
  }

  // const {addressError, addressMutate, addressIsLoading, addressList} = useAdressList()
  const { addressData } = useAddressMain()

  if (cartisLoading) {
    return <Skeleton />
  }

  if (!cartdata) {
    return <div>No items in cart</div>
  }

  return (
    <>
      <div>
        <h1 className="mt-9 text-2xl font-semibold capitalize ">Cart Page</h1>

        <div className="space-y-2 md:flex md:space-x-2">
          <div className="w-full md:w-3/4">
            <ChangeAddressCard
              address={addressData?.data.address || ""}
              name={addressData?.data.name || ""}
              status={addressData?.data.status || 0}
              sub_district={addressData?.data.sub_district || ""}
              district={addressData?.data.district || ""}
              postal_code={addressData?.data.postal_code || ""}
            />
            <CartLineItems
              items={cartdata}
              className="mt-5"
              isCheckable={true}
              onChecked={handleCheckChange}
              checkedItems={checkedItems}
            />
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
                    <span>
                      {checkedItems && Object.keys(checkedItems).length}
                    </span>
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleCheckout} className="w-full">
                  Beli
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
CartPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}

interface ChangeAddressCardProps {
  name: string
  status: number
  address: string
  sub_district: string
  district: string
  postal_code: string
}

export function ChangeAddressCard({
  address,
  sub_district,
  status,
  postal_code,
  name,
  district,
}: ChangeAddressCardProps) {
  return (
    <div>
      <Card className="mt-3 w-full ">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground md:text-xl">
            Shipping Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <div className="flex space-x-1 ">
              <MapPin className="mr-2 " /> {name} •{" "}
              {status == 1 ? (
                <Badge variant="default">Main Address</Badge>
              ) : (
                <div></div>
              )}
            </div>
            <p className="mt-2 truncate text-sm md:mt-3 md:text-base">
              {address}
            </p>
            <p className="truncate text-sm md:mt-0 md:text-base">
              {sub_district}, {district}, {postal_code}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant={"outline"} size={"sm"}>
            Change Address
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
