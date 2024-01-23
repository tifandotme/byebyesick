import React from "react"

import { Button } from "../ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"

export default function Stepper({
  currentStep,
  numberOfSteps,
  items,
  canceled = false,
}: {
  canceled?: boolean
  currentStep: number
  numberOfSteps: number
  items?: {
    label: string
    icon: React.ReactNode
  }[]
}) {
  const activeStepColor = (index: number) =>
    currentStep === index || currentStep > index
      ? canceled
        ? "border-4 border-red-400"
        : "border-4 border-apple-500"
      : "border-4 border-gray-300"
  const activeColor = (index: number) =>
    currentStep > index
      ? canceled
        ? "bg-red-400"
        : "bg-apple-500"
      : "bg-gray-300"
  const isFinalStep = (index: number) => index === numberOfSteps - 1

  return (
    <div className="flex items-center">
      {Array.from({ length: numberOfSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <div
            className={`flex size-10 items-center justify-center rounded-full ${activeStepColor(index)}`}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  {items ? items[index]?.icon : <Button className="size-5" />}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{items ? items[index]?.label : ""}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {isFinalStep(index) ? null : (
            <div className={`h-1 w-5 md:w-10 ${activeColor(index)}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
