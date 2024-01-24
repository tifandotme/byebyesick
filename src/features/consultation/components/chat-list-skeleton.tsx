import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const CHAT_COUNT = 5

export function ChatListSkeleton() {
  return (
    <Card className="mb-20 border-0 sm:border">
      <CardHeader className="mb-6 space-y-2 p-0 sm:mb-0 sm:p-6">
        <Skeleton className="h-6 w-1/6" />
        <Skeleton className="h-5 w-2/5" />
      </CardHeader>
      <CardContent className="p-0 sm:p-6">
        <Skeleton className="mb-7 h-8 w-20" />
        <div className="space-y-14">
          {Array.from({ length: CHAT_COUNT }).map((_, idx) => (
            <div className="flex flex-col gap-5" key={idx}>
              <div className="flex gap-4">
                <Skeleton className="size-14 rounded-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-[22px] w-36" />
                  <Skeleton className="h-[18px] w-56" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-28" />
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
