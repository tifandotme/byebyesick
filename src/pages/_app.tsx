import React from "react"
import { ThemeProvider } from "next-themes"
import { SWRConfig } from "swr"

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
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
      }}
    >
      <ThemeProvider attribute="class">
        {getLayout(<Component {...pageProps} />)}

        <Toaster richColors closeButton />
      </ThemeProvider>
    </SWRConfig>
  )
}
