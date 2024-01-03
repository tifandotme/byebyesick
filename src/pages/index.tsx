import type { ReactElement } from "react"
import React from "react"
import type { GetServerSideProps, GetStaticProps } from "next"
import Head from "next/head"
import { Pill, Tablets } from "lucide-react"

import type { ApiResponse, IDrugClassification } from "@/types/api"
import MainLayout from "@/components/layout/mainLayout"
import { CategoryCard } from "@/features/landing/components/categories/category-card"
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
    return <div>Error: {error}</div>
  }
  return (
    <div>
      <Head>
        <title>ByeByeSick | Home</title>
      </Head>
      <Hero />
      <div className="mt-5 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.data.items.map((cat) => (
          <div key={cat.id}>
            <CategoryCard category={cat.name} icon={<Tablets />} />
          </div>
        ))}
      </div>
    </div>
  )
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
