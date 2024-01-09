import React from "react"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface DoctorCardI {
  name: string
  image: string
  spesialization: string
}

function DoctorCard({ name, image, spesialization }: DoctorCardI) {
  return (
    <Link href={"#"}>
      <Card
        className={`relative flex h-full min-h-40 w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent text-primary shadow-md transition-colors hover:bg-muted/50`}
      >
        <CardHeader>
          <div className="grid h-32 w-32 place-items-center rounded-full border-2">
            <img
              src={image}
              alt={image}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-1.5">
          <CardTitle className="text-center text-xl capitalize">
            {name}
          </CardTitle>
          <CardDescription>{spesialization}</CardDescription>
          <React.Suspense
            fallback={<Skeleton className="h-4 w-20" />}
          ></React.Suspense>
        </CardContent>
      </Card>
    </Link>
  )
}

export default DoctorCard
