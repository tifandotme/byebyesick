import React from "react"
import { useRouter } from "next/router"
import { CalendarIcon, Cross2Icon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function RangeDatePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const router = useRouter()

  const [date, setDate] = React.useState<DateRange | undefined>(undefined)

  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(router.asPath.split("?")[1])

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      }

      return newSearchParams.toString()
    },
    [router.asPath],
  )

  React.useEffect(() => {
    if (!date) {
      router.push(
        {
          pathname: router.asPath.split("?")[0],
          query: createQueryString({
            start_date: null,
            end_date: null,
          }),
        },
        undefined,
        { shallow: true },
      )
      return
    }

    if (Object.values(date).some((v) => !v)) return

    const from = format(date.from as Date, "yyyy-MM-dd")
    const to = format(date.to as Date, "yyyy-MM-dd")

    const params = new URLSearchParams()
    params.set("start_date", from)
    params.set("end_date", to)

    router.push({
      pathname: router.asPath.split("?")[0],
      query: createQueryString({
        start_date: from,
        end_date: to,
      }),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  return (
    <div
      className={cn(
        "flex flex-col-reverse items-center gap-2 overflow-x-auto xs:flex-row",
        className,
      )}
    >
      <Popover>
        {date && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={() => setDate(undefined)}
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end" side="bottom">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
