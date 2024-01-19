import React from "react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { MainLayout } from "@/components/layouts/main"

export default function ConsultationPage() {
  const initials = "JD"

  return (
    <div className="container max-w-4xl p-10">
      <div className="space-y-6">
        <h2 className="mb-5 text-3xl font-extrabold">Consultation</h2>
        <Card>
          <CardHeader>
            <CardTitle>Ongoing</CardTitle>
            <CardDescription>
              Your current ongoing consultations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul>
              {Array.from({ length: 3 }).map((_, idx) => (
                <li
                  key={idx}
                  className={cn(
                    "idx flex list-none flex-col items-start justify-between gap-4 border-b py-7 first:pt-0 last:border-0 last:pb-0 md:flex-row md:items-center",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="size-16">
                      <AvatarImage
                        src="https://picsum.photos/200/200"
                        alt="foo"
                      />
                      {initials ? (
                        <AvatarFallback>
                          JD
                          {/* {session.user.name.slice(0, 2).toUpperCase()} */}
                        </AvatarFallback>
                      ) : (
                        <Icons.Person className="size-10 -translate-y-0.5 p-2 text-muted-foreground" />
                      )}
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-bold leading-tight">
                        dr. John Doe
                      </h3>
                      <div className="my-0.5 flex items-center gap-1.5 text-sm">
                        <span className="relative flex size-[11px]">
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex size-[11px] rounded-full bg-green-500"></span>
                        </span>
                        <span className="font-semibold text-green-600">
                          Online
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last discussion: 12 Jan 2024 12:12 PM
                      </div>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <Button size="sm">Continue Chat</Button>
                    <Button size="sm" variant="secondary">
                      View Profile
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>History</CardTitle>
            <CardDescription>Your past consultations</CardDescription>
          </CardHeader>
          <CardContent>
            {Array.from({ length: 3 }).map((_, idx) => (
              <li
                key={idx}
                className={cn(
                  "idx md:items- flex list-none flex-col items-start justify-between gap-4 border-b py-6 first:pt-0 last:border-0 last:pb-0 md:flex-row",
                )}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="size-16">
                    <AvatarImage
                      src="https://picsum.photos/200/200"
                      alt="foo"
                    />
                    {initials ? (
                      <AvatarFallback>
                        JD
                        {/* {session.user.name.slice(0, 2).toUpperCase()} */}
                      </AvatarFallback>
                    ) : (
                      <Icons.Person className="size-10 -translate-y-0.5 p-2 text-muted-foreground" />
                    )}
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold leading-tight">
                      dr. John Doe
                    </h3>
                    <div className="my-0.5 flex items-center gap-1.5 text-sm">
                      <span className="relative flex size-[11px]">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex size-[11px] rounded-full bg-green-500"></span>
                      </span>
                      <span className="font-semibold text-green-600">
                        Online
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Last discussion: 12 Jan 2024 12:12 PM
                    </div>
                  </div>
                </div>
                <div className="space-x-2">
                  <Button size="sm">Continue Chat</Button>
                  <Button size="sm" variant="secondary">
                    View Profile
                  </Button>
                </div>
              </li>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

ConsultationPage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
