import React from "react"
import useSWR from "swr"

import type { Response } from "@/types"
import type { Province } from "@/types/rajaongkir"
import { useStore } from "@/lib/stores/pharmacies"
import { ComboboxFormItem } from "@/components/combobox-form"

type FormItemProps = Pick<
  React.ComponentProps<typeof ComboboxFormItem>,
  "label" | "value" | "onValueChange" | "data" | "isLoading"
>

type ProvinceComboboxProps = Pick<
  FormItemProps,
  "label" | "value" | "onValueChange"
>

export function ProvinceCombobox({
  label,
  value,
  onValueChange,
}: ProvinceComboboxProps) {
  const isHydrating = useStore((state) => state.isHydrating)
  const provinces = useStore((state) => state.provinces)
  const updateProvinces = useStore((state) => state.updateProvinces)

  const { data, isLoading } = useSWR(
    !provinces && !isHydrating ? "/api/rajaongkir/province" : null,
    async (url: string) => {
      const res = await fetch(url)
      const data: Response<Province[]> = await res.json()

      return data.data
    },
    {
      onSuccess: (data) => {
        data && updateProvinces(data)
      },
      fallbackData: provinces ?? undefined,
    },
  )

  const mappedData = React.useMemo(() => {
    if (!data) return

    return data.map((province) => ({
      label: province.province,
      value: province.province_id,
    }))
  }, [data])

  return (
    <ComboboxFormItem
      className="w-full"
      label={label}
      value={value}
      onValueChange={(value) => {
        onValueChange(value)
      }}
      data={mappedData}
      isLoading={isLoading}
    />
  )
}
