import React from "react"
import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
} from "next"
import Image from "next/image"
import Link from "next/link"
import {
  BadgeIcon,
  CalendarIcon,
  CheckIcon,
  MailIcon,
  TagIcon,
} from "lucide-react"

import type { doctorI, ResponseById, ResponseGetAll } from "@/types/api"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import MainLayout from "@/components/layout/main-layout"

export const getStaticPaths: GetStaticPaths = async () => {
  const url = new URL("/v1/users/doctor", process.env.NEXT_PUBLIC_DB_URL)
  const res = await fetch(url)

  const doctors: ResponseGetAll<doctorI[]> = await res.json()

  const paths = doctors.data.items.map((doc) => ({
    params: { id: doc.id.toString() },
  }))

  return {
    paths,
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps<{
  doctor: ResponseById<doctorI>
}> = async (context) => {
  const url = new URL(
    `/v1/users/doctor/${context?.params?.id}`,
    process.env.NEXT_PUBLIC_DB_URL,
  )
  const res = await fetch(url)

  const doctor = (await res.json()) as ResponseById<doctorI> | undefined

  if (!doctor) {
    return {
      notFound: true,
      revalidate: 60,
    }
  }

  return {
    props: { doctor },
  }
}

function DoctorDetail(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const [isLoading] = React.useState(false)
  console.log(props)
  return (
    <div className="flex w-full items-start justify-center gap-10 p-9 md:flex-row md:gap-10">
      <div className="w-full shrink-0 md:w-1/3">
        <Image
          alt="Doctor's profile photo"
          className="h-auto w-full rounded-lg object-cover"
          height="256"
          src={props.doctor.data.profile_photo || ""}
          style={{
            aspectRatio: "256/256",
            objectFit: "cover",
          }}
          width="256"
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{props.doctor.data.name}</h1>
          <span
            className={`${props.doctor.data.is_online ? "border-apple-200 text-apple-500" : "border-red-200 text-red-500"} rounded-full border px-3 text-xs`}
          >
            {props.doctor.data.is_online ? "Online" : "Offline"}
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 md:text-base">
          {props.doctor.data.doctor_specialization.name}
        </p>
        <div className="flex items-center space-x-2">
          <MailIcon />
          <p className="text-sm">{props.doctor.data.email}</p>
        </div>
        <div className="flex items-center space-x-2">
          <CalendarIcon />
          <p className="text-sm">
            {new Date().getFullYear() - props.doctor.data.starting_year} years
            of experience
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <TagIcon />
          <p className="text-sm">
            {formatPrice(props.doctor.data.consultation_fee)} per consultation
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <CheckIcon className="text-apple-500" />
          <p className="text-sm">Verified</p>
        </div>
        <div className="flex items-center space-x-2">
          <BadgeIcon />
          <Link
            download
            className="text-sm underline"
            target="_blank"
            href={props.doctor.data.doctor_certificate}
          >
            Download Certificate
          </Link>
        </div>
        <div className="space-x-2">
          <Button disabled={isLoading}>
            {isLoading ? "Loading..." : "Chat Doctor"}
          </Button>
        </div>
      </div>
    </div>
  )
}
DoctorDetail.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
export default DoctorDetail
