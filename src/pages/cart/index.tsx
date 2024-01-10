import React, { type ReactElement } from "react"

import { useCartList } from "@/lib/fetchers"
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
import { CheckoutCard } from "@/components/checkout/checkout-card"
import MainLayout from "@/components/layout/main-layout"

export default function CartPage() {
  const { cartdata, cartisLoading } = useCartList()

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
            <CartLineItems
              items={cartdata}
              className="mt-5"
              isCheckable={true}
            />
          </div>

          <div>
            <Card className="w-auto">
              <CardHeader>
                <CardTitle className="text-xl">Payment Summary</CardTitle>
                <CardDescription className="text-sm">
                  Your summary payment here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <p>TES</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Beli</Button>
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
