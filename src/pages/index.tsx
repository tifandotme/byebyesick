import type { ReactElement } from "react"
import React from "react"
import type { GetServerSideProps } from "next"
import Head from "next/head"
import { Pill, Tablets } from "lucide-react"

import type { ProductsCategoriesSchema } from "@/types/api"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import MainLayout from "@/components/layout/mainLayout"
import Hero from "@/features/landing/components/section/hero"

export const getStaticProps: GetStaticProps = async () => {
  try {
    const response = await fetch(
      `http://10.20.191.30:8080/v1/drug-classifications/no-params`,
    )
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()

    if (!data) {
      return {
        notFound: true,
      }
    }
    return { props: { data } }
  } catch (error) {
    console.error("Error fetching data: ", error)
    let errorMessage = "An error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }
    return {
      props: { error: errorMessage },
    }
  }
}
export default function HomePage({
  data,
  error,
}: {
  data: ApiResponse<IDrugClassification[]>
  error: string | undefined
}) {
  if (error) {
    return <div>Error: </div>
  }
  return (
    <div>
      <Head>
        <title>ByeByeSick | Home</title>
      </Head>
      <Hero />
      <div className="mt-5 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <Card className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent transition-colors hover:bg-muted/50">
          <CardHeader>
            <div className="grid h-11 w-11 place-items-center rounded-full border-2">
              {/* <category.icon className="w-5 h-5" aria-hidden="true" /> */}
              <Pill />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-1.5">
            <CardTitle className="font-semibold capitalize leading-tight tracking-tight">
              {"obat"}
            </CardTitle>
            <React.Suspense fallback={<Skeleton className="h-4 w-20" />}>
              {/* <ProductCount productCountPromise={productCountPromise} /> */}
              <CardDescription>100 products</CardDescription>
            </React.Suspense>
          </CardContent>
        </Card>
        <Card className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent transition-colors hover:bg-muted/50">
          <CardHeader>
            <div className="grid h-11 w-11 place-items-center rounded-full border-2">
              {/* <category.icon className="w-5 h-5" aria-hidden="true" /> */}
              <Tablets />
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-1.5">
            <CardTitle className="font-semibold capitalize leading-tight tracking-tight">
              {"obat"}
            </CardTitle>
            <React.Suspense fallback={<Skeleton className="h-4 w-20" />}>
              {/* <ProductCount productCountPromise={productCountPromise} /> */}
              <CardDescription>100 products</CardDescription>
            </React.Suspense>
          </CardContent>
        </Card>
        <Card className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent transition-colors hover:bg-muted/50">
          <CardHeader>
            <div className="grid h-11 w-11 place-items-center rounded-full border-2">
              {/* <category.icon className="w-5 h-5" aria-hidden="true" /> */}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-1.5">
            <CardTitle className="font-semibold capitalize leading-tight tracking-tight">
              {"obat"}
            </CardTitle>
            <React.Suspense fallback={<Skeleton className="h-4 w-20" />}>
              {/* <ProductCount productCountPromise={productCountPromise} /> */}
              <CardDescription>100 products</CardDescription>
            </React.Suspense>
          </CardContent>
        </Card>
        <Card className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent transition-colors hover:bg-muted/50">
          <CardHeader>
            <div className="grid h-11 w-11 place-items-center rounded-full border-2">
              {/* <category.icon className="w-5 h-5" aria-hidden="true" /> */}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-1.5">
            <CardTitle className="font-semibold capitalize leading-tight tracking-tight">
              {"obat"}
            </CardTitle>
            <React.Suspense fallback={<Skeleton className="h-4 w-20" />}>
              {/* <ProductCount productCountPromise={productCountPromise} /> */}
              <CardDescription>100 products</CardDescription>
            </React.Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
