import React from "react"
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons"

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
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxFormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string
  onValueChange: (value: string) => void
  data: { label: string; value: string }[] | undefined
  isLoading?: boolean
}

/**
 * To be used inside FormField's render prop
 */
export function ComboboxFormItem({
  label,
  value,
  onValueChange,
  data,
  isLoading,
  ...props
}: ComboboxFormItemProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <FormItem className={cn("flex flex-col gap-2", props.className)}>
      <FormLabel>{label}</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-full justify-between !border-input font-normal hover:!bg-muted hover:!text-foreground",
                !value && "!text-muted-foreground",
              )}
              disabled={isLoading}
            >
              {value && data
                ? data.find((entry) => entry.value === value)?.label
                : `Select ${label}`}
              <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
            <CommandEmpty>No {label} found.</CommandEmpty>
            <CommandGroup className="max-h-[200px] overflow-y-auto">
              {data?.map((entry) => (
                <CommandItem
                  value={entry.label}
                  key={entry.value}
                  onSelect={() => {
                    onValueChange(entry.value)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      entry.value === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {entry.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  )
}
