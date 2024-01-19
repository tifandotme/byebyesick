import React from "react"
import useSWR from "swr"

import type { AddressResponse, City } from "@/types/api"
import { useStore } from "@/lib/stores/pharmacies"
import { ComboboxFormItem } from "@/components/combobox-form"

type FormItemProps = Pick<
  React.ComponentProps<typeof ComboboxFormItem>,
  "label" | "value" | "onValueChange" | "data" | "isLoading"
>

type CityComboboxProps = {
  provinceId: number
} & Pick<FormItemProps, "label" | "value" | "onValueChange">

export function CityCombobox({
  label,
  value,
  onValueChange,
  provinceId,
}: CityComboboxProps) {
  const cities = useStore((state) => state.cities)
  const updateCities = useStore((state) => state.updateCities)

  const { data, isLoading } = useSWR<AddressResponse<City[]>>(
    provinceId && !cities ? "/v1/address-area/cities/no-params" : null,
    {
      onSuccess: ({ data }) => {
        data && updateCities(data)
      },
      fallbackData: cities ? { data: cities } : undefined,
      keepPreviousData: false,
    },
  )

  const filteredData = React.useMemo(() => {
    if (!data || !provinceId) return

    return data.data
      .filter((city) => city.province_id === provinceId)
      .map((city) => ({
        label: city.city_name,
        value: city.city_id.toString(),
      }))
  }, [data, provinceId])

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
