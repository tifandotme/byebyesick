import React from "react"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { zodResolver } from "@hookform/resolvers/zod"
import { Crosshair2Icon } from "@radix-ui/react-icons"
import type { LatLngLiteral } from "leaflet"
import { useForm, type UseFormReturn } from "react-hook-form"
import { toast } from "sonner"

import type { PharmacyInputs, Response } from "@/types"
import type { Pharmacy } from "@/types/api"
import { updatePharmacy } from "@/lib/fetchers"
import { useStore } from "@/lib/stores/pharmacies"
import { removeLastSegment, toSentenceCase } from "@/lib/utils"
import { pharmacySchema } from "@/lib/validations/pharmacies"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { CityCombobox } from "@/features/pharmacies/components/comboboxes/city"
import { ProvinceCombobox } from "@/features/pharmacies/components/comboboxes/province"
import type { Geocode } from "@/pages/api/geocode"

const LeafletMap = dynamic(() => import("@/components/leaflet-map"), {
  ssr: false,
})

const INITIAL_COORDS = ["-6.175422", "106.82732"] as const // monas

interface PharmacyFormProps {
  mode: "add" | "edit"
  initialData?: Pharmacy
}

export function PharmacyForm({ mode, initialData }: PharmacyFormProps) {
  const router = useRouter()

  const form = useForm<PharmacyInputs>({
    resolver: zodResolver(pharmacySchema),
    defaultValues: {
      name: initialData?.name ?? "",
      address: initialData?.address ?? "",
      subDistrict: initialData?.sub_district ?? "",
      district: initialData?.district ?? "",
      cityId: initialData?.city_id ?? 0,
      provinceId: initialData?.province_id ?? 0,
      postalCode: initialData?.postal_code ?? "",
      latitude: initialData?.latitude ?? INITIAL_COORDS[0],
      longitude: initialData?.longitude ?? INITIAL_COORDS[1],
      opensAt: String(initialData?.operational_hours_open ?? 0),
      closesAt: String(initialData?.operational_hours_close ?? 0),
      operationalDays: initialData?.operational_days ?? [],
      pharmacistName: initialData?.pharmacist_name ?? "",
      pharmacistLicense: initialData?.pharmacist_license_no ?? "",
      pharmacistPhone: initialData?.pharmacist_phone_no ?? "",
    },
  })

  const onSubmit = async (data: PharmacyInputs) => {
    const { success, message } = await updatePharmacy(
      mode,
      data,
      initialData?.id,
    )

    if (success) {
      toast.success(message)
      router.push(removeLastSegment(router.asPath))
    } else {
      toast.error(message)
    }
  }

  React.useEffect(() => {
    form.reset(initialData)
  }, [form, initialData])

  React.useEffect(() => {
    mode === "add" && form.setFocus("name")
  }, [form, mode])

  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-2xl gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Kimia Parma" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Jl. Pangeran" {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <FormField
            control={form.control}
            name="subDistrict"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Sub-district</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="district"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>District</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <FormField
            control={form.control}
            name="provinceId"
            render={({ field }) => (
              <ProvinceCombobox
                label="Province"
                value={field.value.toString()}
                onValueChange={(value) => {
                  form.setValue("provinceId", Number(value))
                  if (form.getValues("cityId")) {
                    form.setValue("cityId", 0)
                  }
                }}
              />
            )}
          />
          <FormField
            control={form.control}
            name="cityId"
            render={({ field }) => (
              <CityCombobox
                label="City"
                value={field.value.toString()}
                onValueChange={(value) =>
                  form.setValue("cityId", Number(value))
                }
                provinceId={form.watch("provinceId")}
              />
            )}
          />
        </div>

        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Postal</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pharmacistName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Pharmacist Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <FormField
            control={form.control}
            name="pharmacistLicense"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Pharmacist License</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pharmacistPhone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Pharmacist Phone Number</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="operationalDays"
          render={() => (
            <FormItem>
              <FormLabel>Operational Days</FormLabel>
              <div className="flex flex-col justify-between gap-3 p-3 lg:flex-row">
                {(
                  ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const
                ).map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="operationalDays"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item}
                          className="flex flex-row items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item,
                                      ),
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel>{toSentenceCase(item)}</FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <FormField
            control={form.control}
            name="opensAt"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Opening Hour</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value: typeof field.value) => {
                    field.onChange(value)
                  }}
                >
                  <FormControl>
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder={field.value} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent side="top" className="max-h-[250px]">
                    <SelectGroup>
                      {Array.from({ length: 23 }, (_, i) => i).map((option) => {
                        const hour = option.toString().padStart(2, "0")

                        return (
                          <SelectItem key={option} value={String(option)}>
                            {`${hour}:00`}
                          </SelectItem>
                        )
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="closesAt"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Closing Hour</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value: typeof field.value) =>
                    field.onChange(value)
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={field.value} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent side="top" className="max-h-[250px]">
                    <SelectGroup>
                      {Array.from({ length: 24 }, (_, i) => i).map((option) => {
                        const hour = option.toString().padStart(2, "0")

                        return (
                          <SelectItem
                            key={option}
                            value={String(option)}
                            disabled={
                              Number(hour) <= Number(form.getValues("opensAt"))
                            }
                          >
                            {`${hour}:00`}
                          </SelectItem>
                        )
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value).toString())
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) =>
                      field.onChange(Number(e.target.value).toString())
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormItem className="mb-3">
          <FormLabel>Geolocation</FormLabel>
          <PinpointButton
            form={form}
            onPinpoint={(coords) => {
              form.setValue("latitude", Number(coords.lat).toString())
              form.setValue("longitude", Number(coords.lng).toString())
            }}
          />

          <AspectRatio ratio={16 / 9} className="z-0 -mx-6 lg:m-0">
            <LeafletMap
              coords={{
                lat: Number(form.watch("latitude")),
                lng: Number(form.watch("longitude")),
              }}
              onCoordsChange={(coords) => {
                form.setValue("latitude", Number(coords.lat).toString())
                form.setValue("longitude", Number(coords.lng).toString())
              }}
              zoom={14}
            />
          </AspectRatio>
          <FormMessage className="text-muted-foreground">
            Marker is draggable. To center view on marker, click anywhere on the
            map.
          </FormMessage>
        </FormItem>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-fit"
          >
            {form.formState.isSubmitting && (
              <Icons.Spinner className="mr-2 size-4 animate-spin" />
            )}
            {toSentenceCase(mode)} pharmacy
          </Button>
        </div>
      </form>
    </Form>
  )
}

interface PinpointButtonProps {
  form: UseFormReturn<PharmacyInputs, any, undefined>
  onPinpoint: (coords: LatLngLiteral) => void
}

function PinpointButton({ form, onPinpoint }: PinpointButtonProps) {
  const cities = useStore((state) => state.cities)
  const provinces = useStore((state) => state.provinces)

  const onClick = async () => {
    const city = cities?.find(
      (city) => city.city_id === form.getValues("cityId"),
    )?.city_name
    const province = provinces?.find(
      (province) => province.province_id === form.getValues("provinceId"),
    )?.province

    const addressArr = [
      ...form.getValues(["address", "district", "subDistrict"]),
      city,
      province,
    ]

    if (addressArr.some((v) => !v)) {
      toast.error(
        "Please fill out address, district, sub-district, city, and province first",
      )
      return
    }

    const address = addressArr.filter((value) => value).join(", ")

    const handlePinpoint = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_PATH}/api/geocode?address=${address}`,
      )

      const data: Response<Geocode[]> = await res.json()
      if (!data.success) throw new Error("Failed to pinpoint location")

      const coords = data.data?.[0]?.location
      if (!coords) throw new Error("Could not find location from address")

      onPinpoint(coords)
    }

    toast.promise(handlePinpoint(), {
      loading: "Pinpointing...",
      success: "Location pinpointed",
      error: (err) => err.message,
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={onClick}
    >
      <Crosshair2Icon className="mr-2 size-3.5" />
      Pinpoint By Address
    </Button>
  )
}
