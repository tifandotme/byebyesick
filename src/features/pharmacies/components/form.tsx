import React from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useRouter } from "next/router"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExternalLinkIcon } from "@radix-ui/react-icons"
import { PopoverClose } from "@radix-ui/react-popover"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type { PharmacyInputs } from "@/types"
import type { Pharmacy } from "@/types/api"
import { toSentenceCase } from "@/lib/utils"
import { pharmacySchema } from "@/lib/validations/pharmacy"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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

const LeafletMap = dynamic(() => import("@/components/leaflet-map"), {
  ssr: false,
})

interface PharmacyFormProps {
  mode: "add" | "edit"
  initialData?: Pharmacy
}

export function PharmacyForm({ mode, initialData }: PharmacyFormProps) {
  const router = useRouter()

  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<PharmacyInputs>({
    resolver: zodResolver(pharmacySchema),
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
      opensAt: initialData?.operational_hours.split("-")[0] ?? "0",
      closesAt: initialData?.operational_hours.split("-")[1] ?? "0",
      operationalDays: initialData?.operational_days ?? [],
      pharmacistName: initialData?.pharmacist_name ?? "",
      pharmacistLicense: initialData?.pharmacist_license_no ?? "",
      pharmacistPhone: initialData?.pharmacist_phone_no ?? "",
    },
  })

  const onSubmit = async (data: PharmacyInputs) => {
    setIsLoading(true)

    console.log(data)

    // const { success, message } = await updatePost(mode, data, initialData?.id)
    // success ? toast.success(message) : toast.error(message)

    setIsLoading(false)
  }

  React.useEffect(() => {
    form.setFocus("name")
  }, [form])
  console.log(form.getValues())

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

          <FormItem className="w-full"></FormItem>
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
                          <FormLabel className="font-normal">
                            {toSentenceCase(item)}
                          </FormLabel>
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
                  <SelectContent side="bottom">
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
                  <SelectContent>
                    <SelectGroup>
                      {Array.from({ length: 23 }, (_, i) => i).map((option) => {
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
          <AspectRatio ratio={16 / 9} className="-mx-6 lg:m-0">
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
              className="mt-1"
            />
          </AspectRatio>
          <FormMessage className="text-muted-foreground">
            Marker is draggable. To center view on marker, click anywhere on the
            map.
          </FormMessage>
        </FormItem>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading} className="w-fit">
            {isLoading && (
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {toSentenceCase(mode)} pharmacy
          </Button>
          {mode === "edit" && initialData && (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="destructive" className="w-fit">
                    Delete
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="max-w-[250px] space-y-4 text-center">
                  <span>Are you sure?</span>
                  <div className="flex gap-2 [&>*]:w-full">
                    <PopoverClose asChild>
                      <Button
                        onClick={() => {
                          const handleDeletion = async () => {
                            // const { success } = await deletePost(initialData.id)

                            // if (!success) throw new Error()

                            router.push("/dashboard/pharmacies")
                          }

                          toast.promise(handleDeletion(), {
                            loading: "Deleting pharmacy...",
                            success: "Pharmacy deleted successfully",
                            error: "Failed to delete pharmacy",
                          })
                        }}
                        size="sm"
                        variant="destructive"
                      >
                        Yes
                      </Button>
                    </PopoverClose>
                    <PopoverClose asChild>
                      <Button size="sm" variant="secondary">
                        No
                      </Button>
                    </PopoverClose>
                  </div>
                </PopoverContent>
              </Popover>
              <Button
                type="button"
                variant="secondary"
                className="w-fit"
                asChild
              >
                <Link
                  href={`/dashboard/pharmacies/${initialData.id}`}
                  target="_blank"
                >
                  View Detail
                  <ExternalLinkIcon className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </form>
    </Form>
  )
}
