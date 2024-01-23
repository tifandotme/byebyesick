import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { GearIcon } from "@radix-ui/react-icons"
import { CheckCircleIcon, ClockIcon, TruckIcon, XIcon } from "lucide-react"
import { getSession } from "next-auth/react"
import { toast } from "sonner"

import type { DetailOrderPageI, ResponseById } from "@/types/api"
import { ORDER_STATUS_MAP } from "@/config"
import { formatDate, formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MainLayout } from "@/components/layouts/main"
import StepContainer from "@/components/step/step-container"
import { confirmReceived } from "@/features/order/api/confrim-received"

import { setTextColor } from ".."

export const getServerSideProps: GetServerSideProps<{
  props: DetailOrderPageI
}> = async (context) => {
  const session = await getSession(context)
  const url =
    process.env.NEXT_PUBLIC_DB_URL + `/v1/orders/${context.query.orderId}`
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session?.user?.token}`,
    },
  })
  const decode: ResponseById<DetailOrderPageI> = await res.json()
  if (!res.ok || decode.data === null) {
    return {
      redirect: {
        destination: `/order`,
        permanent: false,
      },
    }
  }
  const props = decode.data
  return {
    props: {
      props,
    },
  }
}

function OrderDetailPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const [item, setItem] = React.useState<DetailOrderPageI>(props.props)
  const subTotal = item.order_details.reduce((sub: number, curr) => {
    return sub + parseInt(curr.price) * curr.quantity
  }, 0)
  const orderCanceled =
    item.order_status.id == ORDER_STATUS_MAP.CANCELED_BY_PHARMACY

  const handleConfirmReceived = async () => {
    try {
      const resp = await confirmReceived(item.id)
      if (!resp.ok) {
        throw new Error("Something went wrong")
      }
      setItem({
        ...item,
        order_status: {
          id: ORDER_STATUS_MAP.ORDER_CONFIRMED,
          name: "Order Confirmed",
        },
      })
      toast.success("Order Received")
    } catch (error) {
      if (error instanceof Error) toast.error(error.message)
    }
  }
  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-5 p-4 py-9">
        <div className=" self-center text-3xl font-bold">Order Detail</div>
        <StepContainer
          canceled={orderCanceled}
          currentStep={orderCanceled ? 2 : parseInt(item.order_status.id) - 1}
          items={[
            {
              icon: <ClockIcon className="size-5" />,
              label: "Waiting for Pharmacy",
            },
            {
              icon: <GearIcon className="size-5" />,
              label: "Processed",
            },
            {
              icon: orderCanceled ? (
                <XIcon className="size-5" />
              ) : (
                <TruckIcon className="size-5" />
              ),
              label: orderCanceled ? "Canceled" : "Sent",
            },
            {
              icon: <CheckCircleIcon className="size-5" />,
              label: "Order Received",
            },
          ]}
        />

        <Card className="w-full">
          <CardHeader>
            <div className="flex justify-between">
              <div className="text-lg font-bold">Shipment Detail</div>
              <div>
                {item.order_status.id == ORDER_STATUS_MAP.SENT ? (
                  <Button
                    type="button"
                    onClick={() => {
                      handleConfirmReceived()
                    }}
                    variant={"default"}
                  >
                    Confirm Received
                  </Button>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            <div className="flex gap-10">
              <div className="flex flex-col text-sm md:text-xl">
                <div>Shipment Address</div>
                <div className="text-gray-500">{item.user_address}</div>
              </div>
              <div className="flex flex-col text-sm md:text-xl">
                <div>Shipment Method</div>
                <div className="text-gray-500">{item.shippingMethod.name}</div>
              </div>
              <div className="flex flex-col text-sm md:text-xl">
                <div>Order Date</div>
                <div className="text-gray-500">{formatDate(item.date)}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-4 md:p-5">
            <div className="flex w-full items-end justify-between text-base md:text-2xl">
              <div>Shipment Fee:</div>
              <div className="font-bold">{formatPrice(item.shipping_cost)}</div>
            </div>
          </CardFooter>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold">{item.pharmacy.name}</div>
              <div
                className={`${setTextColor(item.order_status.id)} font-bold`}
              >
                {item.order_status.name}
              </div>
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            {item.order_details.map((product) => (
              <div
                key={product.name}
                className="flex items-center justify-between"
              >
                <div className="flex gap-5">
                  <img
                    className="size-20 rounded-md border object-contain"
                    src={product.image}
                    alt=""
                  />
                  <div>
                    <div className="text-sm font-semibold md:text-2xl">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500 md:text-base">
                      {product.content}
                    </div>
                    <div className="text-xs md:text-base">
                      X {product.quantity}
                    </div>
                  </div>
                </div>
                <div className="font-bold md:text-2xl">
                  {formatPrice(product.price)}
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Separator />
            <div className="flex w-full justify-between">
              Product Subtotal
              <div>{formatPrice(subTotal)}</div>
            </div>
            <Separator />
            <div className="flex w-full justify-between">
              Shipment Subtotal
              <div>{formatPrice(item.shipping_cost)}</div>
            </div>

            <Separator />

            <div className="flex w-full items-end justify-between text-base md:text-2xl">
              <div>Total Payment</div>
              <div className="font-bold text-apple-400">
                {formatPrice(50000)}
              </div>
            </div>
          </CardFooter>
        </Card>
        {/* <p>{JSON.stringify(props)}</p> */}
      </div>
    </div>
  )
}

OrderDetailPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
export default OrderDetailPage
