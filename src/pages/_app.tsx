import React from "react"
import Head from "next/head"
import { SessionProvider, signIn, useSession } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { SWRConfig, type Middleware } from "swr"

import type { AppPropsWithLayout } from "@/types/next"
import { fetcher } from "@/lib/fetchers"
import { useStore } from "@/lib/stores/pharmacies"
import { Toaster } from "@/components/ui/sonner"

import "@/styles/globals.css"
import "leaflet/dist/leaflet.css"

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  React.useEffect(() => {
    useStore.persist.rehydrate()
  }, [])

  return (
    <>
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

      <SessionProvider session={pageProps.session}>
        <SWRConfigWrapper>
          <ThemeProvider attribute="class">
            {getLayout(<Component {...pageProps} />)}

            <Toaster richColors closeButton />
          </ThemeProvider>
        </SWRConfigWrapper>
      </SessionProvider>
    </>
  )
}

function SWRConfigWrapper({ children }: React.PropsWithChildren) {
  const { data: session, status } = useSession()

  // TODO remove when auth UI is ready
  React.useEffect(() => {
    if (status !== "unauthenticated") return
    signIn("credentials", {
      redirect: false,
      email: "sena@email.com",
      password: "password",
    })
  }, [status])

  React.useEffect(() => {
    if (!session?.user.token) return

    // "monkey patch" fetch to add the token to all requests
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const [url, options] = args
      return originalFetch(url, {
        ...options,
        headers: { Authorization: `Bearer ${session.user.token}` },
      })
    }
  }, [session])

  // disable all SWR requests when unauthenticated
  const middleware: Middleware = (useSWRNext) => {
    return (key, fetcher, config) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useSWRNext(
        status === "authenticated" ? key : null,
        fetcher,
        config,
      )
    }
  }

  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
        use: [middleware],
      }}
    >
      {children}
    </SWRConfig>
  )
}
