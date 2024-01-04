import type { NextPage } from "next"
import type { AppProps } from "next/app"

type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
