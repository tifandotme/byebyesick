import React from "react"
import { ChevronDown, ChevronRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SortByDropdownProps {
  filter: string
  title: string
  buttonOpener: string
  setFilter: React.Dispatch<React.SetStateAction<string | any>>
  options: { value: string; label: string }[]
}

const DropdownFilter: React.FC<SortByDropdownProps> = ({
  filter,
  buttonOpener,
  title,
  setFilter,
  options,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="outline"
        size={"sm"}
        className="rounded-full border-dashed border-green-300 text-xs text-green-600  hover:bg-green-50 "
      >
        {buttonOpener} <ChevronDown className="ml-1 h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>{title}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
        {options.map((option) => (
          <DropdownMenuRadioItem key={option.value} value={option.value}>
            {option.label}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenu>
)

export default DropdownFilter
