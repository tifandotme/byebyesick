import * as React from "react"
import Link from "next/link"

import { slugify } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface CategoryCardProps {
  category: string
  icon: React.ReactNode
}

export function CategoryCard({ category, icon }: CategoryCardProps) {
  return (
    <Link href={`/categories/${slugify(category)}`}>
      <>
        <span className="sr-only ">{category}</span>
        <Card className="relative flex size-full flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent transition-colors hover:bg-muted/50">
          <CardHeader>
            <div className="grid size-11 place-items-center rounded-full border-2">
              {icon}
            </div>
          </CardHeader>
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
