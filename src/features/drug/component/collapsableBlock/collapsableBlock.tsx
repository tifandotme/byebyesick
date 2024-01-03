import React, { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

import { truncate } from "@/lib/truncate"
import { Button } from "@/components/ui/button"

function CollapsableBlock({ label, value }: { label: string; value: string }) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  return (
    <div>
      <h2 className="font-medium text-primary">{label}</h2>
      <p>{isExpanded ? value : truncate(120, value)}</p>
      <Button
        variant={"link"}
        type="button"
        className="flex w-20 justify-start"
        size={"icon"}
        onClick={() => {
          setIsExpanded(!isExpanded)
        }}
      >
        {isExpanded ? (
          <>
            <div>Close</div>
            <span>
              <ChevronUp />
            </span>
          </>
        ) : (
          <>
            <div>See More</div>
            <span>
              <ChevronDown />
            </span>
          </>
        )}
      </Button>
    </div>
  )
}

export default CollapsableBlock
