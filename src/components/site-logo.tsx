import Link from "next/link"

import { siteConfig } from "@/config"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface SiteLogoProps extends React.HTMLAttributes<HTMLAnchorElement> {
  className?: string
}

export function SiteLogo({ className }: SiteLogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Icons.Logo className="h-10 w-10 dark:brightness-75" aria-hidden="true" />
      <span className="translate-y-[-1px] font-sans text-xl font-black tracking-tight text-neutral-600 dark:text-neutral-400">
        {siteConfig.name}
      </span>
    </Link>
  )
}
