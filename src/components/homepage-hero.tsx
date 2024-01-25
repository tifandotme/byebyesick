import React from "react"
import Link from "next/link"
import {
  ArchiveIcon,
  ArrowRightIcon,
  DotsVerticalIcon,
  MagnifyingGlassIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons"
import { ChevronRight } from "lucide-react"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"

import { Gradient } from "@/lib/gradient.js"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export const HomePageHero = React.memo(function HomePageHero() {
  const { data: session } = useSession()
  const { theme } = useTheme()

  React.useEffect(() => {
    const gradient = new Gradient()

    // @ts-ignore
    gradient.initGradient("#gradient-canvas")
  }, [theme])

  // Hide when logged in user is a doctor
  const showCTA = session?.user.user_role_id !== 3

  return (
    <div className="relative mx-auto mb-[50px] h-[700px] sm:mb-[150px] md:h-[600px]">
      <canvas
        className="gradient absolute top-0 -z-10 size-full"
        id="gradient-canvas"
        data-transition-in
      />

      <div className="relative mx-auto h-[600px] max-w-6xl space-y-4 px-3 pt-40 sm:px-10">
        <Badge
          variant="secondary"
          className="group mb-5 cursor-pointer bg-apple-950/20 px-3 pb-0.5 pt-1 text-sm font-bold text-white hover:bg-apple-950/20 hover:text-white/80"
        >
          2024 Grand Opening. Free consultation.
          <ArrowRightIcon className="ml-1 inline-block size-4 transition-transform group-hover:translate-x-0.5" />
        </Badge>
        <h2 className="flex w-fit flex-col text-start font-display text-[4rem] font-black leading-none tracking-tighter text-apple-950/90 dark:text-apple-100/90 sm:text-[5rem]">
          <span>Next-</span>
          <span>Gen</span>
          <span>Healthcare.</span>
        </h2>
        <p className="!mt-10 max-w-[500px] text-apple-950/90 dark:text-apple-100/90">
          One-stop solution for all your healthcare needs. Shop for medicines,
          consult doctors online.
        </p>
        {showCTA && (
          <div className="!mt-8 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/products/around-you"
              className={cn(
                buttonVariants({ size: "sm" }),
                "h-8 px-4 font-bold",
              )}
            >
              Browse Product
              <ChevronRight className="ml-1 inline-block size-3.5 stroke-[3px]" />
            </Link>
            <Link
              href="/doctors"
              className={cn(
                buttonVariants({ variant: "link", size: "sm" }),
                "font-extrabold text-foreground/80",
              )}
            >
              Start Consultation
              <ChevronRight className="ml-1 inline-block size-3.5 stroke-[3px]" />
            </Link>
          </div>
        )}

        <HomePageAppIllustration />
      </div>
    </div>
  )
})

function HomePageAppIllustration() {
  return (
    <div className="absolute left-[600px] top-[90px] cursor-default">
      <div className="relative">
        <div className="absolute left-0 top-[60px] z-30 flex h-[500px] w-[250px] flex-col rounded-[36px] bg-background p-4 shadow-[0_50px_100px_-20px_rgba(50,50,93,0.25),0_30px_60px_-30px_rgba(0,0,0,0.3),inset_0_-2px_6px_0_rgba(10,37,64,0.35)]">
          <div className="flex items-center gap-3 border-b border-foreground/30 pb-2.5">
            <Avatar className="size-9 rounded-full border border-muted-foreground/10 bg-muted">
              <Icons.Person className="m-auto size-8 p-2 text-muted-foreground" />
            </Avatar>
            <span className="text-sm font-semibold">dr. Jane Doe</span>
          </div>
          <ul className="items grow space-y-2 py-4 text-[0.7rem] leading-tight [&_li]:flex [&_span]:max-w-[75%] [&_span]:rounded-lg [&_span]:px-2 [&_span]:py-1">
            <li>
              <span className="bg-muted">How can I help you?</span>
            </li>
            <li className="flex-row-reverse">
              <span className="bg-primary text-background">
                I{"'"}ve been having a stomach ache for a few days and feeling a
                bit dizzy since yesterday.
              </span>
            </li>
            <li>
              <span className="bg-muted">...</span>
            </li>
            <li className="flex-row-reverse">
              <span className="bg-primary text-background">...</span>
            </li>
            <li>
              <span className="bg-muted">
                I{"'"}m prescribing some medicines. Please try to avoid spicy
                and fried foods for now.
              </span>
            </li>
            <li className="flex translate-y-1 items-center justify-between gap-1 rounded-sm border p-3">
              <ArchiveIcon className="size-3.5 shrink-0 translate-y-[-1px] text-foreground" />
              <span className="w-full grow !p-0">Mylanta 150 ml </span>
              <span className="whitespace-nowrap !p-0 font-bold text-primary hover:underline">
                Add to cart
              </span>
            </li>
          </ul>
          <div className="flex w-full items-center justify-end self-end border-t border-foreground/30 py-3">
            <Button size="icon" className="size-8 cursor-default rounded-sm">
              <PaperPlaneIcon className="size-3" />
            </Button>
          </div>
        </div>

        <div className="absolute left-[110px] top-0 z-20 grid h-[500px] w-[750px] grid-cols-[115px_1fr] grid-rows-[30px_1fr_1fr] gap-6 rounded-[10px] bg-background/50 p-5 text-background shadow-[inset_0_1px_1px_0_hsla(0,0%,100%,.1),_0_50px_100px_-20px_rgba(50,50,93,.25),_0_30px_60px_-30px_rgba(0,0,0,.3)]">
          <div className="flex items-center gap-2 text-background dark:text-foreground">
            <Icons.Pharmacies className="size-5 fill-background stroke-foreground/10 drop-shadow-sm dark:fill-foreground" />
            <span className="text-base font-extrabold drop-shadow-md">
              Acme Inc
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex h-[20px] w-[300px] items-center gap-1 rounded-[4px] bg-background px-1 text-muted-foreground shadow-[0_2px_4px_-1px_rgba(6,24,44,.2)]">
              <MagnifyingGlassIcon className="size-3" />
              <span className="text-[10px]">Search</span>
            </div>
            <Avatar className="size-[27px] rounded-full border border-muted-foreground/10 bg-muted drop-shadow-md">
              <Icons.Person className="m-auto size-[12px] text-muted-foreground" />
            </Avatar>
          </div>
          <div className="col-start-2 flex size-full flex-col rounded-[4px] border bg-background shadow-[0_2px_4px_-1px_rgba(6,24,44,.2)]">
            <div className="border-b p-3 text-[11px] font-extrabold tracking-tight text-foreground/70">
              Sales Report
            </div>

            <div className="flex flex-col p-5">
              <svg
                viewBox="0 0 438 73"
                className="border-b border-foreground/30 pb-1"
              >
                <g fill="none">
                  <polyline
                    stroke="#C5CFD9"
                    strokeWidth="1.2"
                    points="1 71.5 24.333 68.5 48.667 66.5 73 65.5 97.333 61.5 121.667 60.5 146 56.5 170.333 53.5 194.667 48.5 219 43.5 243.333 37.5 267.667 32.5 292 25.5 316.333 20 340.667 16 365 11 389.333 8 413.667 4 437 1"
                  />
                  <circle cx="292" cy="18.5" r="3" fill="hsl(var(--primary))" />
                  <polyline
                    stroke="hsl(var(--primary))"
                    strokeWidth="1.2"
                    points="1 71.5 24.333 67.5 48.667 66.5 73 64.5 97.333 61.5 121.667 60.5 146 55.5 170.333 52.5 194.667 44.5 219 36.5 243.333 29.5 267.667 23.5 292 18.5"
                  />
                </g>
              </svg>
              <div className="flex justify-around pt-2 text-[11px] text-muted-foreground">
                <span className="font-semibold">Nov 2023</span>
                <span className="font-semibold">Des 2023</span>
                <span className="font-extrabold text-primary">Now</span>
              </div>
            </div>
          </div>
          <div className="col-start-2 flex size-full flex-col rounded-[4px] border bg-background shadow-[0_2px_4px_-1px_rgba(6,24,44,.2)]">
            <div className="border-b p-3 text-[11px] font-extrabold tracking-tight text-foreground/70">
              Stock Mutation
            </div>
            <div className="p-4">
              <table className="[&_td]:py- size-full min-w-full divide-y-2 divide-border text-[11px] text-muted-foreground [&_td]:p-2 [&_th]:p-2">
                <thead className="text-left">
                  <tr>
                    <th>Name</th>
                    <th>Manufacturer</th>
                    <th>Quantity</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  <tr>
                    <td>Elixir Mycl</td>
                    <td>Bio Med Inc.</td>
                    <td>42</td>
                    <td>
                      <DotsVerticalIcon className="size-3" />
                    </td>
                  </tr>

                  <tr>
                    <td>Clear Eyedrop</td>
                    <td>Voir Labs Inc.</td>
                    <td>90</td>
                    <td>
                      <DotsVerticalIcon className="size-3" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
