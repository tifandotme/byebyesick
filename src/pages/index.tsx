import type { ReactElement } from "react"
import React from "react"
import type { GetStaticProps } from "next"
import Head from "next/head"
import { Tablets } from "lucide-react"
import useSWR from "swr"

import type {
  ApiResponse,
  IDrugClassification,
  IProduct,
  ResponseGetAll,
} from "@/types/api"
import MainLayout from "@/components/layout/main-layout"
import { CategoryCard } from "@/features/landing/components/categories/category-card"
import Hero from "@/features/landing/components/section/hero"
import { ProductCard } from "@/features/products/components/products-card"

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [response1, response2] = await Promise.all([
      fetch(
        `https://byebyesick-staging.irfancen.com/v1/drug-classifications/no-params`,
      ),
      fetch(`https://byebyesick-staging.irfancen.com/v1/products`),
    ])

    if (!response1.ok || !response2.ok) {
      throw new Error(
        `HTTP error! status: ${response1.status} or ${response2.status}`,
      )
    }

    const [data1, data2] = await Promise.all([
      response1.json(),
      response2.json(),
    ])

    if (!data1 || !data2) {
      return {
        notFound: true,
      }
    }

    return { props: { data1, data2 } }
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
  data1,
  data2,
  error,
}: {
  data1: ApiResponse<IDrugClassification[]>
  data2: ResponseGetAll<IProduct[]>
  error: string | undefined
}) {
  const [latitude, setLatitude] = React.useState<number | null>(null)
  const [longitude, setLongitude] = React.useState<number | null>(null)

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude)
      setLongitude(position.coords.longitude)
    })
  }, [])

  const url =
    latitude && longitude
      ? `https://byebyesick-staging.irfancen.com/v1/products?latitude=${latitude}&longitude=${longitude}`
      : null

  const { data: fix, isLoading } = useSWR<ResponseGetAll<IProduct[]>>(url)
  if (error) return <div>Error: {error}</div>
  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      <Head>
        <title>ByeByeSick | Home</title>
      </Head>

      <Hero />
      {error && (
        <div>
          <p>An error occured please try again</p>
        </div>
      )}
      <div>
        {data1.data.current_page_total_items == 0 ? (
          <div>
            <p>No Product Yet</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data1.data.items.map((cat) => (
              <div key={cat.id}>
                <CategoryCard category={cat.name} icon={<Tablets />} />
              </div>
            ))}
          </div>
        )}
      </div>
      {error && (
        <div>
          <p>An error occured please try again later</p>
        </div>
      )}

      <>
        <div className="mt-5 text-2xl font-semibold">
          <h2>Around You</h2>
        </div>
        {data2.data.current_page_total_items == 0 ? (
          <div>
            <p>No Product Yet</p>
          </div>
        ) : (
          <div className="mb-3 mt-5 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data2.data.items.map((cat) => (
              <div key={cat.id}>
                <ProductCard product={cat} />
              </div>
            ))}
          </div>
        )}
      </>
    </div>
  )
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
