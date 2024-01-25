import Link from "next/link"

import type { Pharmacy } from "@/types/api"
import { getRandomPatternStyle } from "@/lib/generate-pattern"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface PharmacyCardProps {
  pharmacy: Pharmacy
  href: string
}

export function PharmacyCard({ pharmacy, href }: PharmacyCardProps) {
  return (
    <Link href={href}>
      <Card className="h-full overflow-hidden transition-colors hover:bg-muted/50">
        <AspectRatio ratio={21 / 9}>
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-zinc-950/50" />
          <div
            className="h-full rounded-t-md border-b"
            style={getRandomPatternStyle(String(pharmacy.id))}
          />
        </AspectRatio>
        <CardHeader className="space-y-2">
          <CardTitle className="line-clamp-1 text-base">
            {pharmacy.name}
          </CardTitle>
          <CardDescription className="line-clamp-1">
            {pharmacy.address}, {pharmacy.sub_district}, {pharmacy.district}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
