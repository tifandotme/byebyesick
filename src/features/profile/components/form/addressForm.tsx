import React from "react"
import dynamic from "next/dynamic"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { AddressFormSchemaType } from "@/types"
import type { AddressI } from "@/types/api"
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

function AddressForm({ initialData }: { initialData?: AddressI }) {
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
      city: initialData?.city ?? "",
      province: initialData?.province ?? "",
      postalCode: initialData?.postal_code ?? "",
      latitude: Number(initialData?.latitude ?? -6.175422),
      longitude: Number(initialData?.longitude ?? 106.82732),
    },
  })
  return (
    <Form {...form}>
      <form className="grid w-full gap-5">
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
            name="province"
            render={({ field }) => (
              <ProvinceCombobox
                label="Province"
                value={field.value}
                onValueChange={(value) => form.setValue("province", value)}
              />
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <CityCombobox
                provinceId={form.watch("province")}
                label="City"
                value={field.value}
                onValueChange={(value) => form.setValue("city", value)}
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

        <FormItem>
          <FormLabel>Map Preview</FormLabel>
          <FormMessage className="text-muted-foreground">
            Marker is draggable. To center view on marker, click anywhere on the
            map.
          </FormMessage>
          <AspectRatio ratio={16 / 9} className="z-0 -mx-6 lg:m-0">
            <LeafletMap
              coords={{
                lat: form.getValues("latitude"),
                lng: form.getValues("longitude"),
              }}
              onCoordsChange={(coords) => {
                form.setValue("latitude", coords.lat)
                form.setValue("longitude", coords.lng)
              }}
              zoom={14}
              className="mb-2"
            />
          </AspectRatio>
        </FormItem>
        <div className="flex">
          <Button type="button" variant={"default"}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default AddressForm
