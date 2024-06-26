import type { ReactElement } from "react"
import type { GetServerSideProps } from "next"
import Head from "next/head"
import Link from "next/link"
import { ArrowRight, Loader2, MapPin, Tablets } from "lucide-react"
import useSWR from "swr"

import type { IDrugClassification, IProduct, ResponseGetAll } from "@/types/api"
import { useAddressMain } from "@/lib/fetchers"
import useGeolocation from "@/hooks/use-geolocation"
import { Button } from "@/components/ui/button"
import { HomePageHero } from "@/components/homepage-hero"
import { HomeLayout } from "@/components/layouts/home"
import { CarouselSection } from "@/features/landing/components/carousel-section"
import { CategoryCard } from "@/features/landing/components/categories/category-card"
import { ProductCard } from "@/features/products/components/products-card"

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const url =
      (process.env.NEXT_PUBLIC_DB_URL as string) +
      "/v1/drug-classifications/no-params"

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
  const { addressData, addressIsLoading } = useAddressMain()

  const { location, locationError } = useGeolocation()

  const {
    data: around,
    isLoading: loadingAround,
    error: aroundError,
  } = useSWR<ResponseGetAll<IProduct[]>>(
    location
      ? `/v1/products?latitude=${String(location.latitude)}&longitude=${String(
          location.longitude,
        )}`
      : null,
  )

  const { data: productByAddress } = useSWR<ResponseGetAll<IProduct[]>>(
    addressData
      ? `/v1/products?latitude=${addressData.data.latitude}&longitude=${addressData.data.longitude}&`
      : null,
  )

  if (addressIsLoading)
    return (
      <div className="mt-8 flex items-center justify-center">
        <Loader2 className="animate-spin" /> searching products around you....
      </div>
    )

  return (
    <div className="overflow-hidden">
      <Head>
        <title>ByeByeSick | Home</title>
      </Head>

      <HomePageHero />
      <CarouselSection />

      <div className="container relative mb-16 max-w-6xl">
        {error && (
          <div>
            <p>An error occured please try again</p>
          </div>
        )}

        {data?.data.current_page_total_items == 0 ? (
          <div>
            <p>No Product Yet</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data &&
              data.data.items.map((cat) => (
                <div key={cat.id}>
                  <CategoryCard category={cat.name} icon={<Tablets />} />
                </div>
              ))}
          </div>
        )}
        {error && (
          <div>
            <p>An error occured please try again later</p>
          </div>
        )}
        <div className="mt-20 flex justify-between text-2xl font-semibold">
          <h2 className="mt-5 flex items-center">
            <MapPin className="mr-2" /> Around You
          </h2>
          <Link href="/products/around-you">
            <Button variant={"link"}>
              See All <ArrowRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>

        {loadingAround && (
          <div className="">
            <Loader2 className="animate-spin" />
            searching products around you....
          </div>
        )}

        {aroundError && (
          <div>
            {/* PUT ILLUSTRATION HERE */}
            <p>Sorry, an error occured. Please try to refresh this page</p>
          </div>
        )}

        {around?.data.total_items === 0 && (
          <div>
            {/* PUT ILLUSTRATION HERE */}
            <p>There are no products around you</p>
          </div>
        )}

        {locationError && (
          <div>
            <p>
              {" "}
              {locationError}, please allow location permission to see products
            </p>
          </div>
        )}

        <div className="mb-3 mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {around?.data.items.slice(0, 6).map((cat) => (
            <div key={cat.id} className="flex justify-center">
              <ProductCard product={cat} />
            </div>
          ))}
        </div>

        {addressData && (
          <div className="mt-5 flex justify-between text-2xl font-semibold">
            <h2 className="mt-5 flex items-center">
              <MapPin className="mr-2" /> Around{" "}
              {addressData?.data.sub_district}
            </h2>
            <Link href="/products/around-your-district">
              <Button variant={"link"}>
                See All <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        )}

        {productByAddress?.data.total_items === 0 && (
          <div>
            <p>There are no products around {addressData?.data.sub_district}</p>
          </div>
        )}

        <div className="mb-3 mt-5 grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {productByAddress?.data.items.slice(0, 6).map((cat) => (
            <div key={cat.id}>
              <ProductCard product={cat} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <HomeLayout>{page}</HomeLayout>
}
