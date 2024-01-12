import React, { useEffect } from "react"
import dynamic from "next/dynamic"
import { zodResolver } from "@hookform/resolvers/zod"
import { Crosshair2Icon } from "@radix-ui/react-icons"
import type { LatLngLiteral } from "leaflet"
import { useForm, type UseFormReturn } from "react-hook-form"
import { toast } from "sonner"

import type { AddressFormSchemaType, Response } from "@/types"
import type { AddressI } from "@/types/api"
import type { Location } from "@/types/gmaps"
import { useStore } from "@/lib/stores/pharmacies"
import { addressSchema } from "@/lib/validations/address"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CityCombobox } from "@/features/pharmacies/components/comboboxes/city"
import { ProvinceCombobox } from "@/features/pharmacies/components/comboboxes/province"
import type { Geocode } from "@/pages/api/geocode"

function AddressForm({ initialData }: { initialData?: AddressI }) {
  const [point, setPoint] = React.useState<Location>()
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords
        setPoint({ lat: latitude, lng: longitude })
        console.log(latitude, longitude)
      })
    }
  }, [])

  const LeafletMap = dynamic(() => import("@/components/leaflet-map"), {
    ssr: false,
  })
  const form = useForm<AddressFormSchemaType>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      address: initialData?.address ?? "",
      subDistrict: initialData?.subDistrict ?? "",
      district: initialData?.district ?? "",
      cityId: initialData?.cityId ?? 0,
      provinceId: initialData?.provinceId ?? 0,
      postalCode: initialData?.postalCode ?? "",
      latitude: initialData?.latitude ?? "",
      longitude: initialData?.longitude ?? "",
    },
  })

  useEffect(() => {
    if (point && !initialData) {
      form.setValue("longitude", point?.lng.toString())
      form.setValue("latitude", point?.lat.toString())
    }
  }, [point, form, initialData])

  return (
    <Form {...form}>
      <form className="grid w-full gap-5 p-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Alamat Kos" {...field} />
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
                onValueChange={(value) =>
                  form.setValue("provinceId", parseInt(value))
                }
              />
            )}
          />
          <FormField
            control={form.control}
            name="cityId"
            render={({ field }) => (
              <CityCombobox
                provinceId={form.watch("provinceId")}
                label="City"
                value={field.value.toString()}
                onValueChange={(value) =>
                  form.setValue("cityId", parseInt(value))
                }
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
        </div>
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <FormField
            control={form.control}
            name="latitude"
            rules={{}}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    defaultValue={point?.lat}
                    onChange={(e) => field.onChange(+e.target.value)}
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
                    onChange={(e) => field.onChange(+e.target.value)}
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

          <AspectRatio ratio={16 / 9} className="z-0 lg:m-0">
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

        <div className="flex">
          <Button type="button" variant={"default"} size={`sm`}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}

interface PinpointButtonProps {
  form: UseFormReturn<AddressI, any, undefined>
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
      const res = await fetch(`/api/geocode?address=${address}`)

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
      <Crosshair2Icon className="mr-2 h-3.5 w-3.5" />
      Pinpoint By Address
    </Button>
  )
}

export default AddressForm
