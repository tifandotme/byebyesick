import React from "react"
import { PowerCircleIcon } from "lucide-react"
import { toast } from "sonner"

import type { IProfileDoctor } from "@/types/api"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import { setOnlineStatus } from "../../api/set-online-status"

interface SetOnlineButtonProps {
  doctor: IProfileDoctor
  className?: string
}

export function SetOnlineButton({ doctor, className }: SetOnlineButtonProps) {
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
    <Button
      aria-label="Toggle online/offline status"
      className={cn(
        doctorState.is_online
          ? "bg-apple-100 text-apple-500 hover:bg-apple-100/80 hover:text-apple-500 dark:bg-apple-950/20 dark:text-apple-500 dark:hover:bg-apple-950/20 dark:hover:text-apple-500"
          : "bg-red-100 text-red-500 hover:bg-red-100/80 hover:text-red-500 dark:bg-red-950/20 dark:text-red-500 dark:hover:bg-red-950/20 dark:hover:text-red-500",
        className,
      )}
      variant="ghost"
      onClick={() => {
        setStatus(!doctorState.is_online)
      }}
    >
      <PowerCircleIcon className={`size-4`} />
      <span className={`text-sm} ms-3`}>
        {doctorState.is_online ? "Online" : "Offline"}
      </span>
    </Button>
  )
}
