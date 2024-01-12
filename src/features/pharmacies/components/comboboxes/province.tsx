import React from "react"
import useSWR from "swr"

import type { AddressResponse, Province } from "@/types/api"
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

  const { data, isLoading } = useSWR<AddressResponse<Province[]>>(
    !provinces && !isHydrating ? "/v1/address-area/provinces/no-params" : null,
    {
      onSuccess: ({ data }) => {
        data && updateProvinces(data)
      },
      fallbackData: provinces ? { data: provinces } : undefined,
      keepPreviousData: false,
    },
  )

  const mappedData = React.useMemo(() => {
    if (!data) return

    return data.data.map((province) => ({
      label: province.province,
      value: province.province_id.toString(),
    }))
  }, [data])

  return (
    <ComboboxFormItem
      className="w-full"
      label={label}
      value={value}
      onValueChange={onValueChange}
      data={mappedData}
      isLoading={isLoading}
    />
  )
}
