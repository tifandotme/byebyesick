import React from "react"
import Link from "next/link"
import { PowerCircleIcon } from "lucide-react"
import { toast } from "sonner"

import type { IProfileDoctor } from "@/types/api"
import { calculateYear, formatPrice } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { setOnlineStatus } from "../../api/set-online-status"
import DoctorDetailBlock from "../doctor-detail-block/doctor-detail-block"

function DoctorProfileSection(doctor: IProfileDoctor) {
  const [doctorState, setDoctorState] = React.useState(doctor)
  const setStatus = async (status: boolean) => {
    try {
      const resp = await setOnlineStatus(status)
      const decode = await resp.json()
      setDoctorState(decode.data)
      if (!resp.ok) {
        throw new Error("Failed To Update Status")
      }
      toast.success("Status updated successfully")
    } catch (error) {
      const err = error as Error
      toast.error(err.message)
    }
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="size-24 border">
          <AvatarImage
            alt="Doctor's Name"
            src={
              doctorState.profile_photo ||
              "https://cdn0.iconfinder.com/data/icons/communication-456/24/account_profile_user_contact_person_avatar_placeholder-512.png"
            }
          />
        </Avatar>
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold capitalize text-primary">
            {doctorState.name}
          </h1>
          <p className="text-sm text-secondary-foreground">
            {`${doctorState.doctor_specialization}`}
          </p>
        </div>
      </div>
      <DoctorDetailBlock
        title="Consultation Fee"
        content={formatPrice(doctorState.consultation_fee)}
      />
      <DoctorDetailBlock
        title="Experience"
        content={`${calculateYear(doctorState.starting_year)} As ${doctorState.doctor_specialization.name}`}
      />
      <DoctorDetailBlock
        title="Bio"
        content={`${doctorState.name} is a renowned ${doctorState.doctor_specialization} with ${calculateYear(doctorState.starting_year)} of
          experience in the field.`}
      />
      <DoctorDetailBlock
        title="Certificate"
        content={
          <Link
            className="text-blue-400"
            download
            target="_blank"
            href={doctorState.doctor_certificate}
          >
            View Certificate
          </Link>
        }
      />
      <div className="flex w-fit items-center gap-4">
        <Button
          aria-label="Toggle online/offline status"
          className={`${doctorState.is_online ? "bg-apple-50 text-apple-500 hover:text-apple-500" : "bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-500"}`}
          variant={"ghost"}
          onClick={() => {
            setStatus(!doctorState.is_online)
          }}
        >
          <PowerCircleIcon className={`size-4`} />
          <span className={`text-sm} ms-3`}>
            {doctorState.is_online ? "Online" : "Offline"}
          </span>
        </Button>
      </div>
    </div>
  )
}

export default DoctorProfileSection
