import React from "react"
import { useRouter } from "next/router"
import {
  CaretSortIcon,
  CheckIcon,
  CircleIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons"
import useSWR from "swr"

import type { Pharmacy, ResponseGetAll } from "@/types/api"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function PharmacySwitcher() {
  const router = useRouter()

  const { data, isLoading } =
    useSWR<ResponseGetAll<Pharmacy[]>>("/v1/pharmacies")

  const [isOpen, setIsOpen] = React.useState(false)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const pharmacies =
    data?.data.items.map((pharmacy) => ({
      id: pharmacy.id,
      name: pharmacy.name,
    })) ?? []

  const currPharmacy = pharmacies.find((pharmacy) => {
    return pharmacy.id === Number(router.query.pharmacyId as string)
  })

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            aria-label="Select a pharmacy"
            disabled={isLoading}
            className="hidden w-full justify-between px-3 xxs:w-[180px] xs:flex"
          >
            <CircleIcon className="mr-2 size-4 shrink-0" aria-hidden="true" />
            <span className="line-clamp-1">{currPharmacy?.name}</span>
            <CaretSortIcon
              className="ml-auto size-4 shrink-0 opacity-50"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search pharmacy..." />
              <CommandEmpty>No pharmacy found.</CommandEmpty>
              <CommandGroup>
                {pharmacies.map((pharmacy) => (
                  <CommandItem
                    key={pharmacy.id}
                    value={pharmacy.id.toString()}
                    onSelect={() => {
                      router.push({
                        pathname: "/dashboard/pharmacies/[id]",
                        query: { id: pharmacy.id },
                      })
                      setIsOpen(false)
                    }}
                    className="text-sm"
                  >
                    <CircleIcon
                      className="mr-2 size-4 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="line-clamp-1">{pharmacy.name}</span>
                    <CheckIcon
                      className={cn(
                        "ml-auto size-4 shrink-0",
                        currPharmacy?.id === pharmacy.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                      aria-hidden="true"
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      router.push("/dashboard/pharmacies/add")
                      setIsOpen(false)
                      setIsDialogOpen(true)
                    }}
                  >
                    <PlusCircledIcon
                      className="mr-2 size-4"
                      aria-hidden="true"
                    />
                    Create pharmacy
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </Dialog>
  )
}
