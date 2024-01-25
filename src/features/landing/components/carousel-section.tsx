/* eslint-disable @next/next/no-img-element */

import Autoplay from "embla-carousel-autoplay"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface CarouselSectionProps {
  className?: string
}

export function CarouselSection({ className }: CarouselSectionProps) {
  const contentText = [
    {
      text: "Consult with doctors online",
      image: `${process.env.NEXT_PUBLIC_SITE_PATH}/images/doctor-chat.svg`,
      description:
        "Get professional medical advice from the comfort of your home.",
    },
    {
      text: "Order your medications online",
      image: `${process.env.NEXT_PUBLIC_SITE_PATH}/images/doctor-delivery.svg`,
      description:
        "Skip the pharmacy lines. Get your medications delivered to your doorstep.",
    },
    {
      text: "Get your health solutions at one place",
      image: `${process.env.NEXT_PUBLIC_SITE_PATH}/images/doctor-c-3.svg`,
      description:
        "From consultations to medication - we've got all your healthcare needs covered.",
    },
  ]

  return (
    <div className={cn("container max-w-6xl", className)}>
      <Carousel
        className="w-full"
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
      >
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
                  <p className="mt-2 text-center text-sm text-muted-foreground md:text-lg">
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
  )
}
