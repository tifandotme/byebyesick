import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { SWRConfig } from "swr"

import type { AppPropsWithLayout } from "@/types/next"
import { fetcher } from "@/lib/fetchers"
import { useStore } from "@/lib/stores/pharmacies"
import { Toaster } from "@/components/ui/sonner"

import "@/styles/globals.css"
import "leaflet/dist/leaflet.css"

import Head from "next/head"

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  React.useEffect(() => {
    useStore.persist.rehydrate()
  }, [])

  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
      }}
    >
      <SessionProvider session={pageProps.session}>
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
      </SessionProvider>
    </SWRConfig>
  )
}
