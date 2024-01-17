/* eslint-disable react-hooks/rules-of-hooks */

import React from "react"
import Head from "next/head"
import { jwtDecode } from "jwt-decode"
import { SessionProvider, signOut, useSession } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { SWRConfig, type Middleware } from "swr"

import type { AppPropsWithLayout } from "@/types/next"
import type { userJWT } from "@/types/user"
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

            <Toaster richColors />
          </ThemeProvider>
        </SWRConfigWrapper>
      </SessionProvider>
    </>
  )
}

function SWRConfigWrapper({ children }: React.PropsWithChildren) {
  const { data: session, status } = useSession()

  React.useEffect(() => {
    if (!session?.user.token) return

    const decoded: userJWT = jwtDecode(session.user.token)
    if (decoded.exp * 1000 <= Date.now()) signOut()

    // "monkey patch" fetch to add the token to all requests
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const [url, options] = args
      return originalFetch(url, {
        ...options,
        headers: {
          ...options?.headers,
          Authorization: `Bearer ${session.user.token}`,
        },
      })
    }
  }, [session?.user.token])

  // disable all SWR requests when unauthenticated
  const middleware: Middleware = (useSWRNext) => {
    return (key, fetcher, config) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useSWRNext(status !== "loading" ? key : null, fetcher, config)
    }
  }

  return (
    <SWRConfig
      value={{
        fetcher: async (...args: Parameters<typeof fetcher>) => {
          const [endpoint, options] = args
          return fetcher(endpoint, {
            ...options,
            headers: session
              ? { Authorization: `Bearer ${session.user.token}` }
              : undefined,
          })
        },
        revalidateOnFocus: false,
        keepPreviousData: true,
        use: [middleware],
      }}
    >
      {children}
    </SWRConfig>
  )
}
