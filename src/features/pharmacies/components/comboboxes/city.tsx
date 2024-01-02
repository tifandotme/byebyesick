import React from "react"
import useSWR from "swr"

import type { City } from "@/types/rajaongkir"
import { useStore } from "@/lib/stores/pharmacies"
import { ComboboxFormItem } from "@/components/combobox-form"
import type { Response } from "@/pages/api/rajaongkir/province"

type FormItemProps = Pick<
  React.ComponentProps<typeof ComboboxFormItem>,
  "label" | "value" | "onValueChange" | "data" | "isLoading"
>

type CityComboboxProps = Pick<
  FormItemProps,
  "label" | "value" | "onValueChange"
>

export function CityCombobox({
  label,
  value,
  onValueChange,
}: CityComboboxProps) {
  const cities = useStore((state) => state.cities)
  const updateCities = useStore((state) => state.updateCities)
  const provinceId = useStore((state) => state.provinceId)

  const { data, isLoading } = useSWR(
    provinceId && !cities ? "/api/rajaongkir/city" : null,
    async (url: string) => {
      const res = await fetch(url)
      const data: Response<City[]> = await res.json()

      return data.data
    },
    {
      onSuccess: (data) => {
        data && updateCities(data)
      },
      fallbackData: cities ?? undefined,
    },
  )

  console.log("provinceId", provinceId)

  const filteredData = React.useMemo(() => {
    if (!data || !provinceId) return

    return data
      .filter((city) => city.province_id === provinceId)
      .map((city) => ({
        label: `${city.type} ${city.city_name}`,
        value: city.city_id,
      }))
  }, [data, provinceId])

  React.useEffect(() => {
    if (!provinceId || !value) return
    onValueChange("")

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provinceId])

  return (
    <ComboboxFormItem
      className="w-full"
      label={label}
      value={value}
      onValueChange={onValueChange}
      data={filteredData}
      isLoading={isLoading || !provinceId}
    />
  )
}
