import React from "react"
import Head from "next/head"

import { siteConfig } from "@/config"
import { SiteFooter } from "@/components/layouts/site-footer"
import { SiteHeader } from "@/components/layouts/site-header"

export function MainLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Head>
        <title>{siteConfig.name}</title>
      </Head>

      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />

        <main className="flex-1">{children}</main>

        <SiteFooter />
      </div>
    </>
  )
}
