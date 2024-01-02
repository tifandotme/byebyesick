import Head from "next/head"

import { siteConfig } from "@/config"
import { SiteHeader } from "@/components/layouts/site-header"

export function HomeLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <Head>
        <title>{siteConfig.name}</title>
      </Head>

      <div className="relative flex min-h-screen flex-col">
        <SiteHeader />

        <main className="flex-1">{children}</main>
      </div>
    </>
  )
}
