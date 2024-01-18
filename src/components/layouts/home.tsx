import React from "react"
import Head from "next/head"

import { siteConfig } from "@/config"
import { HomeHeader } from "@/components/layouts/home-header"
import { SiteFooter } from "@/components/layouts/site-footer"

export function HomeLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Head>
        <title>{siteConfig.name}</title>
      </Head>

      <div className="relative flex min-h-screen flex-col">
        <HomeHeader />

        <main className="flex-1">{children}</main>

        <SiteFooter />
      </div>
    </>
  )
}
