import Link from "next/link"

import { siteConfig } from "@/config"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { AvatarDropdown } from "@/components/layouts/avatar-dropdown"
import { MainNav } from "@/components/layouts/main-nav"
import { MobileNav } from "@/components/layouts/mobile-nav"
import { SiteLogo } from "@/components/site-logo"

/**
 * Used in most or all pages except the home page.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-20 items-center justify-between">
        <div className="hidden gap-6 md:flex">
          <Link href="/">
            <SiteLogo />
          </Link>
          <MainNav items={siteConfig.mainNav} className="text-[0.95rem]" />
        </div>
        <MobileNav
          mainNavItems={siteConfig.mainNav}
          sidebarNavItems={siteConfig.dashboardNav.byRole}
        />

        <div className="flex items-center space-x-4">
          <Button
            size="icon"
            variant="outline"
            className="size-9 rounded-md bg-transparent"
          >
            <Icons.Cart
              className="size-4 transition-[height,_width]"
              aria-hidden="true"
            />
          </Button>

          <AvatarDropdown />
        </div>
      </div>
    </header>
  )
}
