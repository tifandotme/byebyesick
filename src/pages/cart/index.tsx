import React, { type ReactElement } from "react"

import { useCartList } from "@/lib/fetchers"
import { useCartCheckStore } from "@/lib/stores/cart"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CartLineItems } from "@/components/checkout/cart-items"
import { CheckoutCard } from "@/components/checkout/checkout-card"
import MainLayout from "@/components/layout/main-layout"

export default function CartPage() {
  const { cartdata, cartisLoading } = useCartList()

  const [checkedItems, setCheckedItems] = React.useState({})

  const handleCheckChange = (itemId: string, isChecked: boolean) => {
    setCheckedItems((prevState) => ({ ...prevState, [itemId]: isChecked }))
  }

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
              onChecked={handleCheckChange}
              checkedItems={checkedItems}
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
                  <p>
                    <span>Total Items: </span>

                    <span>
                      {checkedItems && Object.keys(checkedItems).length}
                    </span>
                  </p>
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
