import type { ReactElement } from "react"
import Head from "next/head"
import ClientLayout from "@/features/landing/component/layout/layout"
import Hero from "@/features/landing/component/section/hero"

export default function HomePage() {
  return (
    <div>
      <Head>
        <title>ByeByeSick | Home</title>
      </Head>
      <Hero />
    </div>
  )
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <ClientLayout>{page}</ClientLayout>
}
