import React from "react"
import useSWR from "swr"

import type { ResponseGetAll, Specialization } from "@/types/api"
import { useStore } from "@/lib/stores/specialization"
import { ComboboxFormItem } from "@/components/combobox-form"

type FormItemProps = Pick<
  React.ComponentProps<typeof ComboboxFormItem>,
  "label" | "value" | "onValueChange" | "data" | "isLoading"
>

type CityComboboxProps = {} & Pick<
  FormItemProps,
  "label" | "value" | "onValueChange"
>

export function SpecializationCombobox({
  label,
  value,
  onValueChange,
}: CityComboboxProps) {
  const specialization = useStore((state) => state.specialization)
  const updateSpecialization = useStore((state) => state.updateSpecialization)

  const { data, isLoading } = useSWR<ResponseGetAll<Specialization[]>>(
    "/v1/doctor-specs/no-params",
    {
      onSuccess: ({ data }) => {
        data && updateSpecialization(data.items)
      },
      fallbackData: specialization
        ? ({
            data: {
              items: specialization,
              current_page: 1,
              total_pages: 1,
              total_items: 1,
              current_page_total_items: 1,
            },
          } satisfies ResponseGetAll<Specialization[]>)
        : undefined,
      keepPreviousData: false,
    },
  )

  const filteredData = React.useMemo(() => {
    if (!data || !specialization) return
    return data.data.items.map((specs) => ({
      label: specs.name,
      value: specs.id.toString(),
    }))
  }, [data, specialization])

  return (
    <ComboboxFormItem
      className="w-full"
      label={label}
      value={value ?? "0"}
      defaultValue={"0"}
      onValueChange={onValueChange}
      data={filteredData}
      isLoading={isLoading || !filteredData}
    />
  )
}
