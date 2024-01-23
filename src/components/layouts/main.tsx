import React from "react"
import Head from "next/head"

import { siteConfig } from "@/config"
import { SiteFooter } from "@/components/layouts/site-footer"
import { SiteHeader } from "@/components/layouts/site-header"

interface MainLayoutProps
  extends React.PropsWithChildren<{
    includeFooter?: boolean
  }> {}

export function MainLayout({
  children,
  includeFooter = true,
}: MainLayoutProps) {
  return (
    <>
      <Head>
        <title>{siteConfig.name}</title>
      </Head>

      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />

        <main className="min-h-[calc(100vh-5rem-1px)] flex-1">{children}</main>

        {includeFooter && <SiteFooter />}
      </div>
    </>
  )
}
