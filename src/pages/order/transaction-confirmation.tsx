import React from "react"
import Image from "next/image"
import { CopyIcon } from "lucide-react"
import { toast } from "sonner"

import { copyTextToClipboard, formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { MainLayout } from "@/components/layouts/main"

function TransactionConfirmationPage() {
  const [image, setImage] = React.useState<string>()
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl capitalize">
            Payment Information
          </CardTitle>
          <Separator />
        </CardHeader>
        <CardContent className="items-starts flex flex-col space-y-1.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Bank Account Number</h2>
              <p className="text-sm text-gray-500">7001512477912345678</p>
            </div>
            <Button
              type={"button"}
              variant={"outline"}
              size={"sm"}
              className="flex gap-3"
              onClick={() => {
                copyTextToClipboard("7001512477912345678")
                toast.info("Account Number Copied to clipboard")
              }}
            >
              <CopyIcon className="size-4" /> Copy
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Payment Total</h2>
              <p className="text-sm text-gray-500">{formatPrice(800000)}</p>
            </div>
            <Button
              type={"button"}
              variant={"outline"}
              size={"sm"}
              className="flex gap-3"
              onClick={() => {
                copyTextToClipboard("80000")
                toast.info("Payment Total Copied to clipboard")
              }}
            >
              <CopyIcon className="size-4" /> Copy
            </Button>
          </div>
          <React.Suspense
            fallback={<Skeleton className="h-4 w-20" />}
          ></React.Suspense>
        </CardContent>
      </Card>
      <div className="rounded-md border border-gray-300 bg-white p-4 shadow-sm">
        <CardHeader>
          <CardTitle className="text-center text-xl capitalize">
            Submit Payment Proof
          </CardTitle>
          <Separator />
        </CardHeader>
        <div className="flex flex-col items-center justify-center gap-6">
          <Image
            alt="Payment Proof"
            className="size-64 rounded-md border object-cover p-5"
            src={
              image ||
              "https://cdn1.iconfinder.com/data/icons/business-and-finance-outline-19/64/business-and-finance-outline-19-10-512.png"
            }
            style={{
              aspectRatio: "200/200",
              objectFit: "cover",
            }}
            width="200"
          />
          <Label className="cursor-pointer text-blue-500" htmlFor="file">
            Upload Payment Proof
          </Label>
        </div>
        <div className="mt-4">
          <Input
            className="hidden"
            id="file"
            type="file"
            onChange={(e) => {
              if (!e.target.files) return
              const file = e.target.files[0]
              if (!file) return
              const temp = URL.createObjectURL(file)
              setImage(temp)
            }}
          />
        </div>
        <div className="flex justify-center gap-2 lg:px-20">
          <Button className="w-full" variant={"outline"}>
            Order Detail
          </Button>
          <Button className="w-full">Submit Payment Proof</Button>
        </div>
      </div>
    </div>
  )
}

TransactionConfirmationPage.getLayout = function getLayout(
  page: React.ReactElement,
) {
  return <MainLayout>{page}</MainLayout>
}

export default TransactionConfirmationPage
