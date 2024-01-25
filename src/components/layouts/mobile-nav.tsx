import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { ViewVerticalIcon } from "@radix-ui/react-icons"

import type { MainNavItem, SidebarNavItem } from "@/types"
import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SiteLogo } from "@/components/site-logo"

interface MobileNavProps {
  mainNavItems?: MainNavItem[]
  sidebarNavItems: SidebarNavItem[]
  className?: string
}

export function MobileNav({
  mainNavItems,
  sidebarNavItems,
  className,
}: MobileNavProps) {
  const router = useRouter()
  const pathname = router.asPath.split("?")[0]

  const [open, setOpen] = React.useState(false)

  const items: MainNavItem[] = React.useMemo(() => {
    const accordionItems = (mainNavItems ?? []).filter((item) => item.items)
    const links = (mainNavItems ?? []).filter((item) => !item.items)

    return [
      {
        title: "Manage",
        items: sidebarNavItems,
      },
      ...accordionItems,
      {
        title: "Links",
        items: links,
      },
    ]
  }, [mainNavItems, sidebarNavItems])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "mr-2 flex px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden",
            className,
          )}
        >
          <ViewVerticalIcon className="size-6" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pl-1 pr-0">
        <div className="px-7">
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setOpen(false)}
          >
            <SiteLogo />
          </Link>
        </div>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="pl-1 pr-7">
            <Accordion
              type="multiple"
              defaultValue={items.map((item) => item.title)}
              className="w-full"
            >
              {items?.map((item, idx) => (
                // @ts-ignore
                <AccordionItem value={item.title} key={idx}>
                  {/* @ts-ignore */}
                  <AccordionTrigger className="text-sm font-bold capitalize">
                    {item.title}
                  </AccordionTrigger>
                  {/* @ts-ignore */}
                  <AccordionContent>
                    <div className="flex flex-col space-y-2">
                      {item.items?.map((subItem, index) =>
                        subItem.href ? (
                          <MobileLink
                            key={index}
                            href={String(subItem.href)}
                            pathname={pathname}
                            setOpen={setOpen}
                          >
                            {subItem.title}
                          </MobileLink>
                        ) : (
                          <div
                            key={index}
                            className="text-foreground/70 transition-colors"
                          >
                            {item.title}
                          </div>
                        ),
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps extends React.PropsWithChildren {
  href: string
  pathname?: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function MobileLink({ children, href, pathname, setOpen }: MobileLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "text-foreground/70 transition-colors hover:text-foreground",
        pathname?.includes(href) && "font-semibold text-foreground",
      )}
      onClick={() => setOpen(false)}
    >
      {children}
    </Link>
  )
}
