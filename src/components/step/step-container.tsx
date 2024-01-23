import React from "react"

import Stepper from "./stepper"

function StepContainer({
  currentStep,
  items,
  canceled,
}: {
  canceled?: boolean
  currentStep: number
  items?: {
    label: string
    icon: React.ReactNode
  }[]
}) {
  const NUMBER_OF_STEPS = 4
  return (
    <div>
      <Stepper
        canceled={canceled}
        currentStep={currentStep}
        numberOfSteps={NUMBER_OF_STEPS}
        items={items}
      />
    </div>
  )
}

export default StepContainer
