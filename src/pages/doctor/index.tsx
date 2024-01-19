import React from "react"
import type { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { getSession } from "next-auth/react"

import type { IProfileDoctor, ResponseById } from "@/types/api"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MainLayout } from "@/components/layouts/main"
import DoctorProfileSection from "@/features/doctor/components/doctor-profile/doctor-profile"
import { getDoctorProfile } from "@/features/profile/api/getDoctorProfile"

export const getServerSideProps: GetServerSideProps<{
  userProfile: ResponseById<IProfileDoctor>
}> = async (context) => {
  const session = await getSession(context)
  if (session) {
    const resp = await getDoctorProfile(session.user.token)
    const userProfile = await resp.json()
    return {
      props: {
        userProfile,
      },
    }
  }
  return {
    notFound: true,
  }
}

function DoctorHome(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  return (
    <div className="flex items-center justify-center py-5">
      <div className="flex flex-col gap-8 md:p-6">
        <div className="grid items-start gap-8 md:grid-cols-2">
          <DoctorProfileSection {...props.userProfile.data} />
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Consultation History</h2>
            <div className="group flex flex-col gap-4 rounded-lg border border-gray-200 py-2 dark:border-gray-800">
              <div className="flex flex-1 flex-col">
                <div className="flex items-start p-4">
                  <div className="flex items-start gap-4 text-sm">
                    <Avatar>
                      <AvatarImage alt="@shadcn" />
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="font-semibold">John Smith</div>
                      <div className="line-clamp-1 text-xs">
                        Question about Heart Health
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                    Oct 08, 2023 9:15 AM
                  </div>
                </div>
                <Separator />
                <div className="prose prose-sm flex-1 whitespace-pre-wrap p-4 text-sm prose-p:leading-normal">
                  <p>
                    Hi Dr. Doe, I&apos;ve been experiencing some chest pain
                    lately and I&apos;m worried it might be something serious.
                    Can we schedule a consultation?
                  </p>
                </div>
              </div>
            </div>
            <div className="group flex flex-col gap-4 rounded-lg border border-gray-200 py-2 dark:border-gray-800">
              <div className="flex flex-1 flex-col">
                <div className="flex items-start p-4">
                  <div className="flex items-start gap-4 text-sm">
                    <Avatar>
                      <AvatarImage alt="@shadcn" />
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="font-semibold">Emily Johnson</div>
                      <div className="line-clamp-1 text-xs">
                        Follow-up on Medication
                      </div>
                    </div>
                  </div>
                  <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                    Oct 01, 2023 2:30 PM
                  </div>
                </div>
                <Separator />
                <div className="prose prose-sm flex-1 whitespace-pre-wrap p-4 text-sm prose-p:leading-normal">
                  <p>
                    Hi Dr. Doe, I just wanted to follow up on the medication you
                    prescribed last week. I&apos;ve been taking it as directed,
                    but I&apos;m not noticing any improvements. Should we
                    consider a different treatment plan?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

DoctorHome.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}

export default DoctorHome
