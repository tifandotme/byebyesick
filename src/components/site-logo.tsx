import { siteConfig } from "@/config"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface SiteLogoProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function SiteLogo({ className, ...props }: SiteLogoProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex select-none items-center gap-2 text-neutral-500 dark:text-neutral-300",
        className,
      )}
    >
      <Icons.Logo className="size-10 dark:brightness-75" aria-hidden="true" />
      <h1 className="translate-y-[-1px] font-sans text-xl font-black tracking-tight">
        {siteConfig.name}
      </h1>
    </div>
  )
}
