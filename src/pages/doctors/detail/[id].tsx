import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import Link from "next/link"
import {
  BadgeIcon,
  CalendarIcon,
  CheckIcon,
  MailIcon,
  TagIcon,
} from "lucide-react"

import type { doctorI, ResponseById } from "@/types/api"
import { formatPrice } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { MainLayout } from "@/components/layouts/main"
import { OnlineStatus } from "@/features/consultation/components/online-status"

export const getServerSideProps: GetServerSideProps<{
  doctor: ResponseById<doctorI>
}> = async (context) => {
  const url =
    process.env.NEXT_PUBLIC_DB_URL + `/v1/users/doctor/${context?.params?.id}`
  const res = await fetch(url)

  const doctor = (await res.json()) as ResponseById<doctorI> | undefined

  if (!doctor) {
    return {
      notFound: true,
    }
  }

  return {
    props: { doctor },
  }
}

export default function DoctorDetailPage({
  doctor,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="container mt-10 max-w-3xl">
      <Card>
        <CardHeader className="font-bold">Doctor Detail</CardHeader>
        <CardContent className="flex flex-col items-center md:flex-row">
          <div className="w-full shrink-0 md:w-1/3">
            <Avatar className="size-44 bg-muted">
              <AvatarImage
                src={doctor.data.profile_photo ?? undefined}
                className="object-cover"
                alt={doctor.data.name}
              />
              <Icons.Person className="m-auto size-20 -translate-y-0.5 p-2 text-muted-foreground" />
            </Avatar>
          </div>
          <div className="w-full space-y-4">
            <div className="!mb-7 flex flex-wrap gap-4 whitespace-break-spaces">
              <h2 className="text-3xl font-bold leading-none">
                {doctor.data.name}
              </h2>
              <OnlineStatus doctorId={doctor.data.id} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 md:text-base">
              {doctor.data.doctor_specialization?.name}
            </p>
            <div className="flex items-center space-x-2">
              <MailIcon />
              <p className="text-sm">{doctor.data.email}</p>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon />
              <p className="text-sm">
                {new Date().getFullYear() - doctor.data.starting_year} years of
                experience
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <TagIcon />
              <p className="text-sm">
                {formatPrice(doctor.data.consultation_fee)} per consultation
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
                href={doctor.data.doctor_certificate}
              >
                Download Certificate
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

DoctorDetailPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
