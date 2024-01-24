import React from "react"
import { ArrowRightIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import { Gradient } from "@/lib/gradient.js"
import { Badge } from "@/components/ui/badge"
import { HomeLayout } from "@/components/layouts/home"

export default function HomePages() {
  const { theme } = useTheme()

  React.useEffect(() => {
    const gradient = new Gradient()

    // @ts-ignore
    gradient.initGradient("#gradient-canvas")
  }, [theme])

  return (
    <div>
      <div className="relative mx-auto h-[500px]">
        <canvas
          className="gradient absolute top-0 -z-10 size-full"
          id="gradient-canvas"
          data-transition-in
        />

        <div className="mx-auto max-w-6xl space-y-4 px-10 pt-40">
          <Badge
            variant="secondary"
            className="group mb-5 cursor-pointer bg-apple-950/20 px-3 pb-0.5 pt-1 text-sm font-bold text-white hover:bg-apple-950/20 hover:text-white/80"
          >
            2024 Black Friday Sale. 50% off.
            <ArrowRightIcon className="ml-1 inline-block size-4 transition-transform group-hover:translate-x-0.5" />
          </Badge>
          <h2 className="flex w-fit flex-col text-start font-display text-[5rem] font-black leading-none tracking-tighter text-apple-950/90 dark:text-apple-100/90">
            <span>Next-</span>
            <span>Gen</span>
            <span>Healthcare.</span>
          </h2>
        </div>
      </div>
    </div>
  )
}

HomePages.getLayout = function getLayout(page: React.ReactElement) {
  return <HomeLayout>{page}</HomeLayout>
}
