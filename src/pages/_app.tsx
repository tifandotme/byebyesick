import React from "react"
import Head from "next/head"
import { jwtDecode } from "jwt-decode"
import { SessionProvider, signOut, useSession } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { SWRConfig, type Middleware } from "swr"

import type { AppPropsWithLayout } from "@/types/next"
import type { userJWT } from "@/types/user"
import { fetcher } from "@/lib/fetchers"
import { fonts } from "@/lib/fonts"
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
          rel="icon"
          href={`${process.env.NEXT_PUBLIC_SITE_PATH}/favicon.svg`}
          type="image/svg+xml"
        />
        <style jsx global>
          {`
          <!-- https://github.com/shadcn-ui/ui/issues/138 -->
          :root {
            --font-sans: ${fonts[0].variable};
            --font-mono: ${fonts[1].variable};
            --font-display: ${fonts[2].variable};
          }
        `}
        </style>
      </Head>

      <SessionProvider
        session={pageProps.session}
        basePath={`${process.env.NEXT_PUBLIC_SITE_PATH}/api/auth`}
      >
        <SWRConfigWrapper>
          <ThemeProvider attribute="class" defaultTheme="light">
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

    return () => {
      window.fetch = originalFetch
    }
  }, [session?.user.token])

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
