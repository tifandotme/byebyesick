import type { NextPage } from "next"
import type { AppProps } from "next/app"

type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

declare module "querystring" {
  interface ParsedUrlQuery extends NodeJS.Dict<string | string[]> {
    productId?: string
    pharmacyId?: string

    limit?: string
    drug_class?: string
    page?: string
    per_page?: string
    search?: string
    sort?: string
    start_date?: string
    end_date?: string
    latitude: string
    longitude: string
  }
}
