import React, { useEffect } from "react"
import dynamic from "next/dynamic"
import { zodResolver } from "@hookform/resolvers/zod"
import { Crosshair2Icon } from "@radix-ui/react-icons"
import type { LatLngLiteral } from "leaflet"
import {
  useForm,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form"
import { toast } from "sonner"

import type { AddressFormSchemaType, Response } from "@/types"
import type { AddressI, AddressIForm, ResponseById } from "@/types/api"
import type { Location } from "@/types/gmaps"
import { useAdressList } from "@/lib/fetchers"
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

import { postAddress } from "../../api/postAddress"
import { putAddress } from "../../api/putAddress"

function AddressForm({
  initialData,
  setIsOpen,
}: {
  initialData?: AddressIForm
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [point, setPoint] = React.useState<Location>()
  const { addressMutate } = useAdressList()

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords
        setPoint({ lat: latitude, lng: longitude })
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
      subDistrict: initialData?.sub_district ?? "",
      district: initialData?.district ?? "",
      cityId: initialData?.city_id ?? 0,
      provinceId: initialData?.province_id ?? 0,
      postalCode: initialData?.postal_code ?? "",
      latitude: initialData?.latitude ?? "",
      longitude: initialData?.longitude ?? "",
    },
  })

  const onSubmit: SubmitHandler<AddressFormSchemaType> = async (data) => {
    try {
      if (initialData) {
        const result = await putAddress(
          {
            address: data.address,
            city_id: data.cityId,
            postal_code: data.postalCode,
            province_id: data.provinceId,
            sub_district: data.subDistrict,
            district: data.district,
            latitude: data.latitude,
            longitude: data.longitude,
            name: data.name,
          },
          initialData.id,
        )
        const parsed = await result.json()
        if (!result.ok) {
          if (parsed.errors) throw new Error(parsed.errors[0])
          throw new Error("Failed to add new address")
        }
        toast.success("Success edit address", { duration: 2000 })
      } else {
        const result = await postAddress({
          address: data.address,
          city_id: data.cityId,
          postal_code: data.postalCode,
          province_id: data.provinceId,
          sub_district: data.subDistrict,
          district: data.district,
          latitude: data.latitude,
          longitude: data.longitude,
          name: data.name,
        })
        const parsed: ResponseById<AddressI> = await result.json()
        if (!result.ok) {
          if (parsed.errors) throw new Error(parsed.errors[0])
          throw new Error("Failed to edit address")
        }
        toast.success("Success add new address", { duration: 2000 })
      }
    } catch (error) {
      const err = error as Error
      toast.error(err.message, { duration: 2000 })
    } finally {
      addressMutate()
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (point && !initialData) {
      form.setValue("longitude", point?.lng.toString())
      form.setValue("latitude", point?.lat.toString())
    }
  }, [point, form, initialData])

  return (
    <Form {...form}>
      <form
        className="grid w-full gap-5 p-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
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
          <Button type="submit" variant={"default"} size={`sm`}>
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
      <Crosshair2Icon className="mr-2 size-3.5" />
      Pinpoint By Address
    </Button>
  )
}

export default AddressForm
