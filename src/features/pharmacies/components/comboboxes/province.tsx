import React from "react"
import useSWR from "swr"

import type { Province } from "@/types/rajaongkir"
import { useStore } from "@/lib/stores/pharmacies"
import { ComboboxFormItem } from "@/components/combobox-form"
import type { Response } from "@/pages/api/rajaongkir/province"

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
  const updateProvinceId = useStore((state) => state.updateProvinceId)

  const { data, isLoading } = useSWR(
    "/api/rajaongkir/province",
    async (url: string) => {
      const res = await fetch(url)
      const data: Response<Province[]> = await res.json()

      return data.data?.map((province) => ({
        label: province.province,
        value: province.province_id,
      }))
    },
  )

  return (
    <ComboboxFormItem
      className="w-full"
      label={label}
      value={value}
      onValueChange={(value) => {
        onValueChange(value)
        updateProvinceId(value)
      }}
      data={data}
      isLoading={isLoading}
    />
  )
}