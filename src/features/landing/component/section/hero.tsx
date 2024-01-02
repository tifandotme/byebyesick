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
  const data = ["a", "b", "c", "d"]
  return (
    <div className="p-5">
      <Carousel className="w-full">
        <CarouselPrevious />
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="flex">
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">
                        {data[index]}
                      </span>
                    </CardContent>
                  </Card>
                </div>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ratione nam iusto, minus vitae maiores doloremque,
                        excepturi ipsa esse necessitatibus voluptatum est
                        accusamus sequi illum. Dignissimos.
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
      </Carousel>
    </div>
  )
}

export default Hero
