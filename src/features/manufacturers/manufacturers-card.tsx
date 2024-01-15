import Image from "next/image"
import Link from "next/link"

import type { IManufacturer } from "@/types/api"
import { getRandomPatternStyle } from "@/lib/generate-pattern"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface ManufacturersCardProps {
  manufacturer: IManufacturer
  href: string
}

export function ManufacturersCard({
  manufacturer,
  href,
}: ManufacturersCardProps) {
  // TODO implement
  //   Image for manufacturers

  return (
    <Link href={href}>
      <Card className="h-full overflow-hidden transition-colors hover:bg-muted/50">
        <AspectRatio ratio={21 / 9}>
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-zinc-950/50" />

          <div
            className="h-full rounded-t-md border-b"
            style={getRandomPatternStyle(String(manufacturer.id))}
          >
            <Image
              src={manufacturer.image!}
              fill
              alt={""}
              className="text h-full w-full object-cover"
            />
          </div>
        </AspectRatio>
        <CardHeader className="space-y-2">
          <CardTitle className="line-clamp-1 text-base">
            {manufacturer.name}
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  )
}
