import React from "react"
import { CalendarIcon, CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function YearComboBox({
  setValue,
  value,
}: {
  setValue: React.Dispatch<React.SetStateAction<string>>
  value: string
}) {
  const [open, setOpen] = React.useState(false)
  const minOffset = 0,
    maxOffset = 20
  const thisYear = new Date().getFullYear()
  const allYears = []
  for (let x = minOffset; x <= maxOffset; x++) {
    allYears.push(thisYear - x)
  }
  const yearFilter = allYears.map((year) => ({
    label: year.toString(),
    value: year.toString(),
  }))
  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[100px] justify-between"
          >
            {value
              ? yearFilter.find((year) => year.value === value)?.label
              : "Select year..."}
            <CalendarIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[100px] p-0">
          <Command>
            <CommandInput placeholder="Search Year..." className="h-9" />
            <CommandEmpty>Insert another year</CommandEmpty>
            <CommandGroup className="h-[130px] overflow-auto">
              {yearFilter.map((year) => (
                <CommandItem
                  key={year.value}
                  value={year.value}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {year.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto size-4",
                      value === year.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default YearComboBox
