import React, { useRef } from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Image from "next/image"
import { PrinterIcon } from "lucide-react"
import { getSession } from "next-auth/react"
import { useReactToPrint } from "react-to-print"

import { calculateYear } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import ComponentToPrint from "@/components/component-to-print/component-to-print"
import { imageLoader } from "@/components/image-loader"
import { MainLayout } from "@/components/layouts/main"
import { SiteLogo } from "@/components/site-logo"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const BASE_URL = process.env.NEXT_PUBLIC_DB_URL as string
  const session = await getSession(context)
  try {
    const url = BASE_URL + `/v1/prescriptions/${context.query.sessionId}`
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${session?.user?.token}`,
      },
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json()

    if (!data) {
      return {
        notFound: true,
      }
    }

    return { props: { data } }
  } catch (error) {
    let errorMessage = "An error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return {
      props: { error: errorMessage },
    }
  }
}

function PrescriptionPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const componentRef = useRef<any>()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })
  const data = props.data.data
  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-6xl flex-col items-center justify-center p-2 py-9">
        <div className="my-5 flex w-full max-w-4xl justify-end">
          <Button
            onClick={handlePrint}
            variant={"outline"}
            className="flex gap-3"
          >
            <PrinterIcon /> <div>Print</div>
          </Button>
        </div>
        <Card>
          <ComponentToPrint ref={componentRef}>
            <div className="flex size-full min-h-[11.25in] flex-col">
              <CardHeader>
                <div className="flex justify-between">
                  <div className="text-start text-lg font-semibold capitalize">
                    <div>{data.doctor.name}</div>
                    <div className="text-gray-500">
                      {data.doctor.doctor_specialization}
                    </div>
                  </div>
                  <SiteLogo />
                </div>
                <Separator />
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 px-10">
                  <div className="mb-5 flex items-center justify-center text-xl font-bold">
                    Digital Prescription
                  </div>
                  {data.prescription_products.map((item: any) => {
                    const { product } = item
                    return (
                      <div key={item.id} className="flex items-start gap-5">
                        <Image
                          loader={imageLoader}
                          className="rounded-md border bg-black object-cover"
                          src={product.image}
                          width={100}
                          height={100}
                          alt={product.name}
                        />
                        <div className="flex flex-col">
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-gray-500">{product.content}</div>
                          <div className="text-sm text-gray-500">
                            {item.note}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
              <div className="flex h-full grow items-end">
                <CardFooter className="flex w-full flex-col items-start justify-end space-y-5">
                  <div>
                    This document is a valid examination result uploaded by the
                    healthcare provider through the ByeByeSick application.
                  </div>
                  <Separator />
                  <div>
                    Patient Name:{" "}
                    <span className="font-semibold capitalize">
                      {data.user.name},{" "}
                      {calculateYear(
                        new Date(data.user.date_of_birth).getFullYear(),
                      )}
                    </span>
                  </div>
                </CardFooter>
              </div>
            </div>
          </ComponentToPrint>
        </Card>
      </div>
    </div>
  )
}
PrescriptionPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
export default PrescriptionPage
