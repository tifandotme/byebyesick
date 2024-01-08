/* eslint-disable @next/next/no-img-element */

import React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

function Hero() {
  const contentText = [
    {
      text: "Consult with doctors online",
      image: "/images/doctor-chat.svg",
      description:
        "Get professional medical advice from the comfort of your home.",
    },
    {
      text: "Order your medications online",
      image: "/images/doctor-delivery.svg",
      description:
        "Skip the pharmacy lines. Get your medications delivered to your doorstep.",
    },
    {
      text: "Get your health solutions at one place",
      image: "/images/doctor-c-3.svg",
      description:
        "From consultations to medication - we've got all your healthcare needs covered.",
    },
  ]
  return (
    <>
      <div className="pt-0 md:pt-0 ">
        <section className="mx-auto mt-8 w-full items-center justify-center gap-4 text-center md:mt-0 md:flex md:min-h-screen">
          <div className="flex flex-col">
            <h1 className="font-heading inline-block text-balance bg-gradient-to-r from-green-600 via-green-300 to-green-600 bg-clip-text text-center text-4xl font-bold text-transparent md:text-left md:text-6xl lg:text-7xl">
              Your One Stop Health Solutions
            </h1>
            <p className="mt-6 text-center leading-normal text-muted-foreground sm:text-lg sm:leading-8 md:text-left">
              Chat with doctors, visit hospitals, buy medicine, check labs and
              updates Information about health can all be found at ByeByeSick!
            </p>
            <div className="mt-3 flex items-center justify-center space-x-2 md:justify-start ">
              <Button>Buy Now</Button>
              <Button variant="outline" className="hover:bg-apple-200">
                Chat Doctors
              </Button>
            </div>
          </div>

          <img
            src="/images/doctor-homepage.svg"
            className=""
            width="600px"
            height="600px"
            alt=""
          />
        </section>
        <div className="">
          <Carousel className="w-full">
            <CarouselPrevious />
            <CarouselContent>
              {contentText.map((item, index) => (
                <CarouselItem key={index}>
                  <Card className="w-full">
                    <CardContent className="flex flex-col items-center justify-center p-6">
                      <img
                        src={item.image}
                        width="200px"
                        height="200px"
                        alt={item.text}
                      />
                      <span className="text-sm font-semibold md:text-4xl">
                        {item.text}
                      </span>
                      <p className="mt-2 text-center text-sm md:text-lg">
                        {item.description}
                      </p>
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
