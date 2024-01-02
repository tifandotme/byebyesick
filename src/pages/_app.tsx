import { ThemeProvider } from "next-themes"
import { SWRConfig } from "swr"

import type { AppPropsWithLayout } from "@/types/next"
import { fetcher } from "@/lib/fetchers"
import { Toaster } from "@/components/ui/sonner"

import "@/styles/globals.css"

import Head from "next/head"

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
      }}
    >
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <ThemeProvider attribute="class">
        {getLayout(
          <>
            <Component {...pageProps} /> <Toaster richColors closeButton />
          </>,
        )}
      </ThemeProvider>
    </SWRConfig>
  )
}
