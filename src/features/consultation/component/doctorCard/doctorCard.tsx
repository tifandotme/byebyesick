import React from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

import type { doctorI } from "@/types/api"
import { formatPrice } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { startChat } from "../../api/start-chat"

function DoctorCard({
  name,
  profile_photo,
  doctor_specialization,
  starting_year,
  is_online,
  consultation_fee,
  id,
}: doctorI) {
  const { push } = useRouter()
  const { data: session } = useSession()
  const handleStartChat = async () => {
    try {
      const res = await startChat(id, session?.user?.user_id)
      if (!res.ok) {
        throw new Error("Failed to start chat with Status code: " + res.status)
      }
      const data = await res.json()
      console.log(data)
      push("/consultation/as-patient/" + data.id)
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge variant={is_online ? "success" : "destructive"}>
            {is_online ? "Online" : "Offline"}
          </Badge>
          <CardTitle className="text-sm capitalize md:text-xl lg:text-2xl">
            {name}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <Avatar className="size-24">
            <AvatarImage
              alt="Dr. Jane Doe"
              src={
                profile_photo ||
                "https://www.saarmagazine.nl/wp-content/uploads/2017/07/dokter-.jpg"
              }
            />
          </Avatar>
          <div className="grid gap-1 text-xs md:text-lg">
            <div className="text-sm font-semibold md:text-xl">
              {formatPrice(consultation_fee)}
            </div>
            <div className="text-muted-foreground">
              Specialization: {doctor_specialization?.name}
            </div>
            <div>
              Experience: {new Date().getFullYear() - starting_year} years
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-3">
        <Button
          variant="outline"
          size={"sm"}
          type="button"
          onClick={() => {
            push("/doctors/detail/" + id)
          }}
        >
          View Profile
        </Button>
        <Button
          variant="default"
          onClick={() => {
            handleStartChat()
          }}
          size={"sm"}
          type="button"
        >
          Chat Doctor
        </Button>
      </CardFooter>
    </Card>
  )
}

export default DoctorCard
