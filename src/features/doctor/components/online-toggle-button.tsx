import { PowerCircleIcon } from "lucide-react"
import { toast } from "sonner"
import useSWR from "swr"

import type { IProfileDoctor, ResponseById } from "@/types/api"
import { updateOnlineStatus } from "@/lib/fetchers"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface OnlineToggleButtonProps {
  className?: string
}

export function OnlineToggleButton({ className }: OnlineToggleButtonProps) {
  const { data, mutate } =
    useSWR<ResponseById<IProfileDoctor>>("/v1/profile/doctor")

  const isOnline = data?.data.is_online

  return (
    <Button
      aria-label="Toggle online/offline status"
      className={cn(
        isOnline
          ? "bg-apple-100 text-apple-500 hover:bg-apple-100/80 hover:text-apple-500 dark:bg-apple-950/20 dark:text-apple-500 dark:hover:bg-apple-950/20 dark:hover:text-apple-500"
          : "bg-red-100 text-red-500 hover:bg-red-100/80 hover:text-red-500 dark:bg-red-950/20 dark:text-red-500 dark:hover:bg-red-950/20 dark:hover:text-red-500",
        className,
      )}
      variant="ghost"
      onClick={() => {
        const handleToggle = async () => {
          const { success } = await updateOnlineStatus(!isOnline)

          if (!success) throw new Error()
          await mutate()
        }

        toast.promise(handleToggle(), {
          loading: "Changing online status...",
          success: "Online status changed",
          error: "Failed to change online status",
        })
      }}
    >
      <PowerCircleIcon className={`size-4`} />
      <span className="ms-3 text-sm">{isOnline ? "Online" : "Offline"}</span>
    </Button>
  )
}
