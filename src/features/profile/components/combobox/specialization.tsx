import React from "react"
import useSWR from "swr"

import type { AddressResponse, City, Specialization } from "@/types/api"
import { useStore } from "@/lib/stores/specialization"
import { ComboboxFormItem } from "@/components/combobox-form"

type FormItemProps = Pick<
  React.ComponentProps<typeof ComboboxFormItem>,
  "label" | "value" | "onValueChange" | "data" | "isLoading"
>

type CityComboboxProps = {
  specializationId: number
} & Pick<FormItemProps, "label" | "value" | "onValueChange">

export function SpecializationCombobox({
  label,
  value,
  onValueChange,
  specializationId,
}: CityComboboxProps) {
  const specialization = useStore((state) => state.specialization)
  const updateSpecialization = useStore((state) => state.updateSpecialization)

  const { data, isLoading } = useSWR<AddressResponse<Specialization[]>>(
    specializationId && !specialization
      ? "v1/address-area/cities/no-params"
      : null,
    {
      onSuccess: ({ data }) => {
        data && updateSpecialization(data)
      },
      fallbackData: specialization ? { data: specialization } : undefined,
      keepPreviousData: false,
    },
  )

  const filteredData = React.useMemo(() => {
    if (!data || !specialization) return

    return data.data.map((city) => ({
      label: city.name,
      value: city.id.toString(),
    }))
  }, [data])

  return (
    <ComboboxFormItem
      className="w-full"
      label={label}
      value={value}
      onValueChange={onValueChange}
      data={filteredData}
      isLoading={isLoading || !filteredData}
    />
  )
}
