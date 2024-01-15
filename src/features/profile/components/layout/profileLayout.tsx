import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { MapPinIcon, UserIcon } from "lucide-react"
import { useSession } from "next-auth/react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

function ProfileLayout({
  children,
  desc,
  title,
  action,
}: {
  children: React.ReactNode
  title: string
  desc: string
  action?: React.ReactNode
}) {
  const { data: session } = useSession()
  const { pathname } = useRouter()
  return (
    <div className="flex flex-col gap-5 py-5 md:flex-row">
      <Card className="h-fit md:w-1/2">
        <CardHeader className="flex flex-col items-center">
          <img
            alt="Man"
            src={
              session?.user.image ??
              "https://cdn0.iconfinder.com/data/icons/communication-456/24/account_profile_user_contact_person_avatar_placeholder-512.png"
            }
            className="h-24 w-24 rounded-full object-cover"
          />
          <CardTitle>{session?.user.name}</CardTitle>
          <CardDescription>{session?.user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-3 flex w-full flex-row gap-2 p-1 md:flex-col">
            <Link
              href={"/user/profile"}
              className={`${
                pathname === "/user/profile"
                  ? "bg-secondary text-secondary-foreground"
                  : "text-primary"
              } rounded-md py-2 hover:bg-muted hover:text-foreground`}
            >
              <span
                className={
                  "group flex w-full flex-row items-start gap-4 rounded-md border border-transparent px-2 py-1 hover:bg-muted hover:text-foreground"
                }
              >
                <span>
                  <UserIcon />
                </span>
                <span>Profile</span>
              </span>
            </Link>
            <Link
              href={"/user/address"}
              className={`${
                pathname === "/user/address"
                  ? "bg-secondary text-secondary-foreground"
                  : "text-primary"
              } rounded-md py-2 hover:bg-muted hover:text-foreground`}
            >
              <span
                className={
                  "group flex w-full flex-row items-end gap-4 rounded-md border border-transparent px-2 py-1"
                }
              >
                <span>
                  <MapPinIcon />
                </span>
                <span>Address</span>
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
      <Card className="h-fit w-full">
        <CardHeader>
          <div className="flex flex-row justify-between">
            <div>
              <CardTitle className="text-base md:text-2xl">{title}</CardTitle>
              <CardDescription className="text-xs md:text-base">
                {desc}
              </CardDescription>
            </div>
            <div>{action}</div>
          </div>
          <Separator />
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}

export default ProfileLayout
