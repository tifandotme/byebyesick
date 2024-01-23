import Link from "next/link"

import { siteConfig } from "@/config"
import { cn } from "@/lib/utils"
import { useWindowScroll } from "@/hooks/use-window-scroll"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { AvatarDropdown } from "@/components/layouts/avatar-dropdown"
import { MainNav } from "@/components/layouts/main-nav"
import { MobileNav } from "@/components/layouts/mobile-nav"
import { SiteLogo } from "@/components/site-logo"

/**
 * Used only in the home page.
 */
export function HomeHeader() {
  const { y } = useWindowScroll()
  const isScrolled = y > 100

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full border-b bg-background transition-colors duration-300",
        !isScrolled && "border-0 bg-transparent",
      )}
    >
      <div
        className={cn(
          "container flex h-20 items-center justify-between transition-[height]",
          !isScrolled && "h-28",
        )}
      >
        <div className="hidden gap-6 md:flex">
          <Link href="/">
            <SiteLogo
              className={cn(
                "drop-shadow-lg",
                !isScrolled && "text-neutral-50 dark:text-white",
              )}
            />
          </Link>
          <MainNav
            items={siteConfig.mainNav}
            className={cn(
              "text-[0.95rem]",
              !isScrolled &&
                "!bg-transparent font-bold text-background drop-shadow-lg hover:text-background/70 focus:text-background active:text-background dark:text-white hover:dark:text-white/70",
            )}
          />
        </div>
        <MobileNav
          mainNavItems={siteConfig.mainNav}
          sidebarNavItems={siteConfig.dashboardNav.byRole}
          className={cn(
            !isScrolled &&
              "text-background drop-shadow-lg hover:text-background/70 dark:text-white hover:dark:text-white/70",
          )}
        />

        <div
          className={cn(
            "flex items-center space-x-6",
            !isScrolled && "space-x-4",
          )}
        >
          <Button
            size="icon"
            variant="outline"
            className={cn(
              "size-9 rounded-md bg-transparent",
              !isScrolled &&
                "border-0 text-background drop-shadow-md hover:text-background/70",
            )}
          >
            <Icons.Cart
              className={cn(
                "size-4 transition-[height,_width]",
                !isScrolled && "size-5",
              )}
              aria-hidden="true"
            />
          </Button>

          <AvatarDropdown className={cn(!isScrolled && "size-12")} />
        </div>
      </div>
    </header>
  )
}
