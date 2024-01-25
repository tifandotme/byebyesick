import Link from "next/link"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

import type { doctorI } from "@/types/api"
import { startConsultation } from "@/lib/fetchers"
import { cn, formatPrice } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { OnlineStatus } from "@/features/consultation/components/online-status"

export function DoctorCard({
  name,
  profile_photo,
  doctor_specialization,
  starting_year,
  consultation_fee,
  id,
}: doctorI) {
  const router = useRouter()

  const { data: session, status } = useSession()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-sm capitalize md:text-xl lg:text-2xl">
            {name}
          </CardTitle>
          <OnlineStatus doctorId={id} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <Avatar className="size-20 bg-muted">
            {profile_photo ? (
              <AvatarImage
                src={profile_photo ?? undefined}
                className="object-cover"
                alt={name ?? undefined}
              />
            ) : (
              <Icons.Person className="m-auto size-12 -translate-y-0.5 p-2 text-muted-foreground" />
            )}
          </Avatar>
          <div className="grid w-full gap-1 text-xs md:text-base">
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
        <Link
          href={`/doctors/detail/${id}`}
          className={cn(
            buttonVariants({
              size: "sm",
              variant: "outline",
            }),
          )}
        >
          View Profile
        </Link>
        <Button
          onClick={() => {
            if (!session?.user?.user_id) return

            const handleStartChat = async () => {
              const { success, data: sessionId } = await startConsultation({
                doctor_id: id,
                user_id: session.user.user_id,
              })

              if (!success) throw new Error()

              router.push("/consultation/as-patient/" + sessionId)
            }

            toast.promise(handleStartChat(), {
              loading: "Starting consultation...",
              success: "Consultation started",
              error: "Failed to start consultation",
            })
          }}
          size="sm"
          disabled={status === "unauthenticated"}
        >
          Chat Doctor
        </Button>
      </CardFooter>
    </Card>
  )
}
