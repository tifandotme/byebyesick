import Link from "next/link"

import type { FooterItem } from "@/types"
import { siteConfig } from "@/config"
import { ThemeToggle } from "@/components/layouts/theme-toggle"
import { SiteLogo } from "@/components/site-logo"

export function SiteFooter() {
  return (
    <footer className="grid w-full items-center gap-8 border-t bg-background pb-8 pt-6 md:py-8">
      <section className="container flex flex-col gap-10 lg:flex-row lg:gap-20">
        <section>
          <Link href="/">
            <SiteLogo />
          </Link>
        </section>
        <section className="grid flex-1 grid-cols-1 gap-10 xxs:grid-cols-2 sm:grid-cols-4">
          {(siteConfig.footerNav as FooterItem[]).map((item) => (
            <div key={item.title} className="space-y-3">
              <h4 className="text-base font-medium">{item.title}</h4>
              <ul className="space-y-2.5">
                {item.items.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noreferrer" : undefined}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </section>
      <section className="container flex items-center space-x-4">
        <div className="flex-1 text-left text-sm leading-loose text-muted-foreground">
          <span className="inline-block translate-y-[1px] text-[16px] font-bold">
            &copy;
          </span>{" "}
          {new Date().getFullYear()} {siteConfig.name}
        </div>
        <div className="flex items-center space-x-1">
          <ThemeToggle />
        </div>
      </section>
    </footer>
  )
}
