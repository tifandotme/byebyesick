import React from "react"
import Link from "next/link"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cross2Icon,
} from "@radix-ui/react-icons"
import useSWR from "swr"

import type { ChatRoom, ResponseGetAll } from "@/types/api"
import { cn, formatDateChat } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/icons"
import { ChatListSkeleton } from "@/features/consultation/components/chat-list-skeleton"
import { OnlineStatus } from "@/features/consultation/components/online-status"

interface ChatListProps {
  status: "ongoing" | "ended"
  as: "patient" | "doctor"
}

export function ChatList({ status, as }: ChatListProps) {
  const [page, setPage] = React.useState(1)
  const [sort, setSort] = React.useState<"asc" | "desc" | null>(null)

  const { data, isLoading } = useSWR<ResponseGetAll<ChatRoom[]>>(() => {
    const params = new URLSearchParams()
    params.set("status", status === "ongoing" ? "1" : "2")
    params.set("page", String(page))
    params.set("limit", "5")
    if (sort) params.set("sort_by", "date")
    if (sort) params.set("sort", sort)

    return `/v1/chats?${params.toString()}`
  })

  return (
    <>
      {isLoading && !data && <ChatListSkeleton />}
      {data && (
        <>
          <Card className="border-0 sm:border">
            <CardHeader className="mb-6 p-0 sm:mb-0 sm:p-6">
              <CardTitle>
                {status === "ongoing" ? "Ongoing" : "History"}
              </CardTitle>
              <CardDescription>
                {status === "ongoing"
                  ? "Your ongoing consultation"
                  : "Your past consultation"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mb-7 h-8 data-[state=open]:bg-accent"
                    disabled={isLoading || !data?.data.items.length}
                  >
                    <span>Date</span>
                    {sort === "desc" ? (
                      <ArrowDownIcon className="ml-2 size-4" />
                    ) : sort === "asc" ? (
                      <ArrowUpIcon className="ml-2 size-4" />
                    ) : (
                      <CaretSortIcon className="ml-2 size-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="top">
                  <DropdownMenuItem onSelect={() => setSort("asc")}>
                    <ArrowUpIcon className="mr-2 size-3.5 text-muted-foreground/70" />
                    Asc
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setSort("desc")}>
                    <ArrowDownIcon className="mr-2 size-3.5 text-muted-foreground/70" />
                    Desc
                  </DropdownMenuItem>
                  {sort && (
                    <DropdownMenuItem onClick={() => setSort(null)}>
                      <Cross2Icon className="mr-2 size-3.5 text-muted-foreground/70" />
                      Reset
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {!data?.data.items.length ? (
                <div className="inline-flex h-20 w-full items-center justify-center text-sm text-muted-foreground">
                  No data
                </div>
              ) : (
                <ul>
                  {data.data.items.map((chat) => {
                    const lastMessage =
                      chat.messages[chat.messages.length - 1]?.message
                    const profile = chat[as === "patient" ? "doctor" : "user"]
                    return (
                      <li
                        key={chat.id}
                        className={cn(
                          "flex list-none flex-col items-start justify-between gap-5 border-b py-7 first:pt-0 last:border-0 last:pb-0",
                        )}
                      >
                        <div className="flex w-full items-center gap-4">
                          <Avatar className="size-14">
                            <AvatarImage
                              src={profile.profile_photo ?? undefined}
                              className="object-cover object-center"
                              alt="foo"
                            />
                            {chat.doctor.name ? (
                              <AvatarFallback>
                                {profile.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            ) : (
                              <Icons.Person className="size-10 -translate-y-0.5 p-2 text-muted-foreground" />
                            )}
                          </Avatar>
                          <div className="flex w-full flex-col gap-1">
                            <div className="flex gap-2">
                              <div className="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-2">
                                <h3 className="text-lg font-bold leading-none">
                                  {profile.name}
                                </h3>
                                {as === "patient" && (
                                  <OnlineStatus
                                    doctorId={chat.doctor.user_id}
                                  />
                                )}
                              </div>
                              <time
                                dateTime={chat.updated_at}
                                className="ml-auto text-xs text-muted-foreground"
                              >
                                {formatDateChat(chat.updated_at)}
                              </time>
                            </div>
                            <p
                              className={cn(
                                "line-clamp-1 text-sm text-muted-foreground",
                                !lastMessage?.length && "italic",
                              )}
                            >
                              {lastMessage?.length
                                ? lastMessage
                                : "No message yet"}
                            </p>
                          </div>
                        </div>
                        <div className="space-x-2">
                          <Link
                            href={`/consultation/${as === "patient" ? "as-patient" : "as-doctor"}/${chat.id}`}
                            className={cn(buttonVariants({ size: "sm" }))}
                          >
                            {status === "ongoing" ? "Continue" : "View"}
                            &nbsp;Chat
                          </Link>
                          {as === "patient" && (
                            <Link
                              href={`/doctors/detail/${chat.doctor_id}`}
                              className={cn(
                                buttonVariants({
                                  size: "sm",
                                  variant: "secondary",
                                }),
                              )}
                            >
                              View Profile
                            </Link>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          <div className="mb-8 mt-3 space-x-2 text-right">
            <Button
              variant="outline"
              size="icon"
              className="size-9"
              disabled={page === 1}
              onClick={() =>
                setPage((prev) => {
                  if (prev === 1) return prev
                  return prev - 1
                })
              }
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-9"
              disabled={data?.data.total_pages === page}
              onClick={() =>
                setPage((prev) => {
                  if (data?.data.total_pages === prev) return prev
                  return prev + 1
                })
              }
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </>
      )}
    </>
  )
}
