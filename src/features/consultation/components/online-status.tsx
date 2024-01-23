import useSWR from "swr"

import type { IProfileDoctor, ResponseById } from "@/types/api"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface OnlineStatusProps {
  doctorId: number
  textOnly?: boolean
}

export function OnlineStatus({
  doctorId,
  textOnly = false,
}: OnlineStatusProps) {
  const { data, isLoading } = useSWR<ResponseById<IProfileDoctor>>(
    `/v1/users/doctor/${doctorId}`,
    {
      refreshInterval: 3000,
      revalidateOnFocus: true,
    },
  )

  if (textOnly) {
    return data?.data.is_online ? "Online" : "Offline"
  }

  return (
    <>
      {isLoading && !data && <Skeleton className="h-[21.79px] w-14" />}
      {data && (
        <Badge
          className={cn(
            data.data.is_online
              ? "border-apple-600 text-apple-600"
              : "border-amber-600 text-amber-600",
            "w-fit",
          )}
          variant="outline"
        >
          {data.data.is_online ? "Online" : "Offline"}
        </Badge>
      )}
    </>
  )
}
