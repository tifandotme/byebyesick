import type { ReactElement } from "react"
import React from "react"
import type { GetStaticProps } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { ArrowRight, Tablets } from "lucide-react"
import { useSession } from "next-auth/react"
import useSWR from "swr"

import type { IDrugClassification, IProduct, ResponseGetAll } from "@/types/api"
import { useAddressById } from "@/lib/fetchers"
import { Button } from "@/components/ui/button"
import MainLayout from "@/components/layout/main-layout"
import { CategoryCard } from "@/features/landing/components/categories/category-card"
import Hero from "@/features/landing/components/section/hero"
import { ProductCard } from "@/features/products/components/products-card"

export const getStaticProps: GetStaticProps = async () => {
  try {
    const url = new URL(
      "/v1/drug-classifications/no-params",
      process.env.NEXT_PUBLIC_DB_URL,
    )

    const response = await fetch(url)

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
  data: ResponseGetAll<IDrugClassification[]>
  error: string | undefined
}) {
  const { data: session } = useSession()
  const dbUrl = process.env.NEXT_PUBLIC_DB_URL

  const [latitude, setLatitude] = React.useState<number | null>(null)
  const [longitude, setLongitude] = React.useState<number | null>(null)
  const [locationError, setLocationError] = React.useState<string | null>(null)
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
          setLocationError(null)
        },
        (err) => {
          setLocationError(err.message)
        },
      )
    } else {
      setLocationError("Geolocation is not supported by this browser.")
    }
  }, [latitude, longitude])

  const { addressData } = useAddressById(session?.user?.user_id ?? 0)

  const url =
    latitude && longitude
      ? `${dbUrl}/v1/products?latitude=${latitude}&longitude=${longitude}`
      : null

  const { data: around, isLoading: loadingAround } =
    useSWR<ResponseGetAll<IProduct[]>>(url)

  const { data: productByAddress } = useSWR<ResponseGetAll<IProduct[]>>(
    `${dbUrl}/v1/products?latitude=${addressData?.latitude}&longitude=${addressData?.longitude}`,
  )

  if (loadingAround) return <div>Loading...</div>

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
        {data.data.current_page_total_items == 0 ? (
          <div>
            <p>No Product Yet</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data.data.items.map((cat) => (
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
        <div className="mt-5 flex justify-between text-2xl font-semibold">
          <h2>Around You</h2>
          <Link href="/products/around-you">
            <Button variant={"link"}>
              See All <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>

        {around?.data.total_items === 0 && (
          <div>
            <p>There are no products around you</p>
          </div>
        )}

        {locationError && (
          <div>
            <p>{locationError}</p>
          </div>
        )}

        <div className="mb-3 mt-5 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {around?.data.items.map((cat) => (
            <div key={cat.id}>
              <ProductCard product={cat} />
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-between text-2xl font-semibold">
          <h2>Around {addressData?.subDistrict}</h2>
          <Link href="/products/around-your-district">
            <Button variant={"link"}>
              <p></p>See All <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>
        {productByAddress?.data.total_items === 0 && (
          <div>
            <p>There are no products around {addressData?.subDistrict}</p>
          </div>
        )}
        <div className="mb-3 mt-5 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {productByAddress?.data.items.map((cat) => (
            <div key={cat.id}>
              <ProductCard product={cat} />
            </div>
          ))}
        </div>
      </>
    </div>
  )
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>
}
