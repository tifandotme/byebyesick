import * as React from "react"
import Image from "next/image"
import Link from "next/link"

import { slugify } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface CategoryCardProps {
  category: string
  icon?: React.ReactNode
  link: string
  background?: string
}

export function CategoryCard({
  link,
  category,
  icon,
  background,
}: CategoryCardProps) {
  return (
    <Link href={`${link}/${slugify(category)}`}>
      <>
        <span className="sr-only ">{category}</span>
        <Card
          className={`relative flex size-full min-h-40 flex-col items-center justify-center${
            background
              ? " bg-black/50 text-primary-foreground hover:text-primary"
              : "bg-transparent"
          } overflow-hidden rounded-lg transition-colors hover:bg-muted/50`}
        >
          {background && (
            <div className="absolute -z-10 size-full">
              <Image
                src={background}
                className="size-full object-cover"
                alt={""}
                fill
              />
            </div>
          )}
          {icon && (
            <CardHeader>
              <div className="grid size-11 place-items-center rounded-full border-2">
                {icon}
              </div>
            </CardHeader>
          )}
          <CardContent className="flex flex-col items-center space-y-1.5">
            <CardTitle className="text-center text-xl capitalize">
              {category}
            </CardTitle>
            <React.Suspense
              fallback={<Skeleton className="h-4 w-20" />}
            ></React.Suspense>
          </CardContent>
        </Card>
      </>
    </Link>
  )
}
