import { ThemeProvider } from "next-themes"
import { SWRConfig } from "swr"

import type { AppPropsWithLayout } from "@/types/next"
import { fetcher } from "@/lib/fetchers"

import "@/styles/globals.css"

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateOnFocus: false,
      }}
    >
      <ThemeProvider attribute="class">
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </SWRConfig>
  )
}
