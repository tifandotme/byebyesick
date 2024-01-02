import React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

function Hero() {
  const contentText = ["a", "b", "c"]
  return (
    <>
      <div className="container max-w-6xl pt-0 md:pt-0">
        <section className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-4 py-12 text-center md:pt-32">
          <h1 className="font-heading text-balance text-center text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
            Your One Stop Health Solutions
          </h1>
          <p className="mt-6 max-w-6xl text-center leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Chat with doctors, visit hospitals, buy medicine, check labs and
            updates Information about health can all be found at ByeByeSick!
          </p>
        </section>
        <div className="p-5">
          <Carousel className="w-full">
            <CarouselPrevious />
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                  <Card>
                    <CardContent className="flex items-center justify-center p-6">
                      <span className="text-4xl font-semibold ">
                        {contentText.map((c, index) => (
                          <div key={index}>{c}</div>
                        ))}
                      </span>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselNext />
          </Carousel>
        </div>
      </div>
    </>
  )
}

export default Hero
