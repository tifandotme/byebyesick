import type { ReactElement } from "react"
import Head from "next/head"
import Hero from "@/features/landing/component/section/hero"

import MainLayout from "@/components/layout/mainLayout"

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
  return <MainLayout>{page}</MainLayout>
}
