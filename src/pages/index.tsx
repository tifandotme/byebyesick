import type { ReactElement } from "react"
import React from "react"
import type { GetStaticProps } from "next"
import Head from "next/head"
import { Tablets } from "lucide-react"

import type { ApiResponse, IDrugClassification, IProduct } from "@/types/api"
import MainLayout from "@/components/layout/mainLayout"
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
  data2: ApiResponse<IProduct[]>
  error: string | undefined
}) {
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
          <div className="mt-5 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
          <div className="mt-5 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data2.data.items.map((cat) => (
              <div key={cat.id}>
                <ProductCard
                  product={{
                    data: cat,
                  }}
                />
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
