import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { ChevronRightIcon, ViewVerticalIcon } from "@radix-ui/react-icons"

import { dashboardConfig, siteConfig } from "@/config"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icons } from "@/components/icons"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 flex px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <ViewVerticalIcon className="h-6 w-6" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pl-1 pr-0">
        <div className="px-7">
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setOpen(false)}
          >
            <Icons.Logo className="mr-2 h-4 w-4" />
            <span className="font-bold">{siteConfig.name}</span>
          </Link>
        </div>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="pl-1 pr-7">
            <Sidebar />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export function Sidebar() {
  const pathname = useRouter().pathname

  return (
    <div className="mt-3 flex w-full flex-col gap-2 p-1">
      {dashboardConfig.sidebarNav.map((item) => {
        const Icon = item.icon ? Icons[item.icon] : ChevronRightIcon

        return (
          <Link key={item.title} href={item.href}>
            <span
              className={cn(
                "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:bg-muted hover:text-foreground",

                pathname.includes(item.href)
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
            </span>
          </Link>
        )
      })}
    </div>
  )
}
