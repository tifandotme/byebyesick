import React, { useRef } from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { PrinterIcon } from "lucide-react"
import { getSession } from "next-auth/react"
import { useReactToPrint } from "react-to-print"

import { calculateYear, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import ComponentToPrint from "@/components/component-to-print/component-to-print"
import { MainLayout } from "@/components/layouts/main"
import { SiteLogo } from "@/components/site-logo"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const BASE_URL = process.env.NEXT_PUBLIC_DB_URL as string
  const session = await getSession(context)
  try {
    const url = BASE_URL + `/v1/sick-leave-forms/${context.query.roomId}`
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

function SickLeavePage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  const componentRef = useRef<any>()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })
  const data = props.data.data

  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full max-w-4xl p-2 py-9">
        <div className="relative">
          <div className="absolute  right-5 top-5">
            <Button onClick={handlePrint} className="flex gap-3">
              <PrinterIcon /> <div>Print</div>
            </Button>
          </div>
          <Card>
            <ComponentToPrint ref={componentRef}>
              <div className="flex size-full min-h-[9.25in] flex-col">
                <CardHeader>
                  <SiteLogo />
                  <Separator />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold md:text-2xl">
                        Patient Information
                      </h2>
                      <div className="text-sm md:text-lg">
                        Issued at: {formatDate(data.created_at)}
                      </div>
                    </div>
                    <div className="flex items-start justify-start gap-10">
                      <div className="flex flex-col gap-1">
                        <div className="font-bold">Patient Name:</div>
                        <div>{data.user.name}</div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="font-bold">Age:</div>
                        <div>
                          {calculateYear(
                            new Date(data.user.date_of_birth).getFullYear(),
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="font-bold">Birth Date:</div>
                      <div>{formatDate(data.user.date_of_birth)}</div>
                    </div>
                    <h2 className="text-xl font-bold ">Doctor Note</h2>

                    <div className="space-y-3">
                      <p>
                        We informed that the patient is diagnosed with
                        {data.prescription.diagnosis}, the symptoms are{" "}
                        {data.prescription.symptoms} that the patient told
                        during the consultation.
                      </p>
                      <p>
                        Based on the symptoms, we suggest the patient to take a
                        rest at home from {formatDate(data.starting_date)} until{" "}
                        {formatDate(data.ending_date)}.
                      </p>
                      <p>
                        Please be advised that the above information has been
                        provided in accordance with the doctor&apos;s
                        assessment. If there are any further inquiries or
                        updates regarding the medical condition, feel free to
                        reach out. This is provided as part of further
                        consideration by the other parties. Thank you for your
                        understanding and cooperation.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <div className="flex h-full grow items-end">
                  <CardFooter className="flex w-full flex-col items-start justify-end space-y-5">
                    <div className="flex w-full justify-end">
                      <div className="space-y-4">
                        <div className="text-lg font-bold">
                          Corresponding Doctor
                        </div>
                        <div className="text-end text-lg font-semibold capitalize">
                          <div>{data.doctor.name}</div>
                          <div className="text-gray-500">
                            {data.doctor.doctor_specialization}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      This document is a valid examination result uploaded by
                      the healthcare provider through the ByeByeSick
                      application.
                    </div>
                  </CardFooter>
                </div>
              </div>
            </ComponentToPrint>
          </Card>
        </div>
      </div>
    </div>
  )
}

SickLeavePage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}

export default SickLeavePage
