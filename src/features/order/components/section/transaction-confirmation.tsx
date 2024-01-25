import React from "react"
import { useRouter } from "next/router"
import { CopyIcon, Trash2Icon, TrashIcon } from "lucide-react"
import { toast } from "sonner"

import type { ITransactionConfirmation } from "@/types/api"
import { copyTextToClipboard, formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import ImagePicker from "@/components/image-picker/image-picker"

import { uploadPaymentProof } from "../../api/upload-payment-proof"

function TransacrionConfirmationSection(props: ITransactionConfirmation) {
  const handleImageDrop = (file: File) => {
    if (!file) return
    const temp = URL.createObjectURL(file)
    if (file.size > 500000) {
      toast.error("File size must be less than 500Kb")
      return
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only jpg, jpeg, and png files are allowed")
      return
    }
    if (
      file.type !== "image/png" &&
      file.type !== "image/jpeg" &&
      file.type !== "image/jpg"
    ) {
      toast.error("File must be image")
      return
    }
    setImage({ file, url: temp })
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const file = e.target.files[0]
    if (!file) return
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only jpg, jpeg, and png files are allowed")
      return
    }
    const temp = URL.createObjectURL(file)
    if (file.size > 500000) {
      toast.error("File size must be less than 500Kb")
      return
    }
    setImage({ file, url: temp })
  }
  const router = useRouter()
  const [image, setImage] = React.useState<{
    url: string
    file: File
  } | null>(null)
  const submit = async () => {
    if (!image || !image.file) {
      toast.error("Please upload payment proof")
      return
    }
    const resp = await uploadPaymentProof(
      image.file,
      router.query.transactionId,
    )
    if (!resp.ok) {
      toast.error(resp.statusText || "Failed to upload payment proof")
      return
    }
    toast.success("Payment proof uploaded")
    router.replace(`/order/transaction-detail/${router.query.transactionId}`)
  }
  return (
    <>
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
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Payment Total</h2>
              <p className="text-sm text-gray-500">
                {formatPrice(props.total_payment)}
              </p>
            </div>
            <Button
              type={"button"}
              variant={"outline"}
              size={"sm"}
              className="flex gap-3"
              onClick={() => {
                copyTextToClipboard(props.total_payment)
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
      <div className="flex flex-col gap-5 rounded-md border border-gray-300 bg-white p-4 shadow-sm">
        <CardTitle className="text-center text-xl capitalize">
          Submit Payment Proof
        </CardTitle>
        <div className="mb-3 px-6">
          <ImagePicker
            image={image?.url}
            handleDrop={handleImageDrop}
            onChange={handleChange}
          />
          {image && (
            <Button
              className="mt-2 space-x-2"
              variant={"destructive"}
              onClick={() => setImage(null)}
            >
              <span>Remove</span>
            </Button>
          )}
        </div>
        <div className="flex justify-center gap-2 lg:px-20">
          <Button
            className="w-full"
            variant={"outline"}
            onClick={() => {
              router.push(
                `/order/transaction-detail/${router.query.transactionId}`,
              )
            }}
          >
            Order Detail
          </Button>
          <Button
            className="w-full"
            onClick={() => {
              submit()
            }}
          >
            Submit Payment Proof
          </Button>
        </div>
      </div>
    </>
  )
}

export default TransacrionConfirmationSection
