import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Clock10Icon } from "lucide-react"

import type { ITransaction } from "@/types/api"
import { formatDate, formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SiteLogo } from "@/components/site-logo"

function TransactionDetailSection(transaction: ITransaction) {
  console.log(transaction)

  const renderBadge = (status: number) => {
    switch (status) {
      case 1:
        return <Badge variant={"destructive"}>Unpaid</Badge>
      case 2:
        return <Badge className="bg-orange-500">Waiting for Confirmation</Badge>
      case 3:
        return <Badge className="bg-yellow-500">Payment Rejected</Badge>
      case 4:
        return <Badge variant={"success"}>Paid</Badge>
      case 5:
        return <Badge variant={"destructive"}>Canceled</Badge>
      default:
        return <Badge variant={"default"}>Unknown</Badge>
    }
  }

  const totalPrice = transaction.orders.reduce(
    (total, order) =>
      total +
      order.order_details.reduce(
        (total, detail) =>
          total + Number(detail.price) * Number(detail.quantity),
        0,
      ) +
      Number(order.shipping_cost),
    0,
  )

  return (
    <>
      <div className="container flex min-h-screen max-w-3xl flex-col p-6">
        <header className="flex flex-col items-center gap-4">
          <SiteLogo />
          <div className="text-center">
            <h1 className="text-2xl font-bold">ByeByeSick Inc.</h1>
            <p>Sopo Del Building, The Sky, L30, Lot 10.1-6</p>
            <p>(123) 456-7890</p>
            <p>byebyesick@gmail.com</p>
          </div>
        </header>
        <main className="mt-8 flex-1">
          <section className="mb-8 space-y-2">
            <p></p>
            <p className="capitalize">{transaction.address}</p>
            <p>{transaction.payment_method}</p>
            {renderBadge(transaction.transaction_status.id)}
            <p className="text-orange-500">
              <Clock10Icon className="mr-1 inline-block " />
              {formatDate(
                new Date(
                  new Date(transaction.date).setDate(
                    new Date(transaction.date).getDate() + 4,
                  ),
                ),
              )}
            </p>
          </section>
          <section className="mb-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Total Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transaction.orders.map((order, orderIndex) =>
                  order.order_details.map((detail, detailIndex) => (
                    <TableRow key={`order-${orderIndex}-detail-${detailIndex}`}>
                      <TableCell>{detail.name}</TableCell>
                      <TableCell>{detail.quantity}</TableCell>
                      <TableCell>{formatPrice(detail.price)}</TableCell>
                      <TableCell>
                        {formatPrice(
                          Number(detail.price) * Number(detail.quantity),
                        )}
                      </TableCell>
                    </TableRow>
                  )),
                )}
              </TableBody>
            </Table>
          </section>
          <section className="mb-8">
            <div className="flex justify-between">
              <p>Sub payment:</p>
              <p>
                {formatPrice(
                  transaction.orders.reduce(
                    (total, order) =>
                      total +
                      order.order_details.reduce(
                        (total, detail) =>
                          total +
                          Number(detail.price) * Number(detail.quantity),
                        0,
                      ),
                    0,
                  ),
                )}
              </p>
            </div>
            <div className="flex justify-between">
              <p>Shipping Cost:</p>
              <p>
                {formatPrice(
                  transaction.orders.reduce(
                    (total, order) => total + Number(order.shipping_cost),
                    0,
                  ),
                )}
              </p>
            </div>
            <div className="flex justify-between font-bold">
              <p>Total:</p>
              <p>{formatPrice(totalPrice)}</p>
            </div>
            {!transaction.payment_proof && (
              <div>
                <Link
                  href={`/order/transaction-confirmation/${transaction.id}`}
                >
                  <Button className="mt-6 w-full" variant={"outline"}>
                    Upload your payment proof
                  </Button>
                </Link>
              </div>
            )}
            {transaction.payment_proof && (
              <Dialog>
                <DialogTrigger asChild className="mt-6">
                  <Button variant="outline" className="w-full">
                    Payment Proof
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Payment Proof</DialogTitle>
                  </DialogHeader>
                  <div>
                    <Image
                      src={transaction.payment_proof}
                      width={700}
                      height={700}
                      alt=""
                    />
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </section>
        </main>
      </div>
    </>
  )
}

export default TransactionDetailSection
