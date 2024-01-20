/* eslint-disable @next/next/no-img-element */

import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExternalLinkIcon } from "@radix-ui/react-icons"
import { Loader2, UploadCloudIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import useSWR from "swr"

import type { ProductInputs } from "@/types"
import {
  type ApiResponse,
  type IDrugClassification,
  type IManufacturer,
  type IProductCategory,
  type ProductsSchema,
} from "@/types/api"
import { updateProducts } from "@/lib/fetchers"
import { toSentenceCase } from "@/lib/utils"
import { productSchema } from "@/lib/validations/products-schema"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
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

interface ProductFormProps {
  mode: "add" | "edit"
  initialProductData?: ProductsSchema
}

export default function ProductForm({
  mode,
  initialProductData,
}: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [preview, setPreview] = React.useState<string | null>()

  const { data: prodcat } = useSWR<ApiResponse<IProductCategory[]>>(
    `/v1/product-categories`,
  )
  const { data: prodmanuf } = useSWR<ApiResponse<IManufacturer[]>>(
    `/v1/manufacturers/no-params`,
  )
  const { data: drugclass } = useSWR<ApiResponse<IDrugClassification[]>>(
    `/v1/drug-classifications/no-params`,
  )

  const form = useForm<ProductInputs>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialProductData?.data.name ?? "",
      generic_name: initialProductData?.data.generic_name ?? "",
      content: initialProductData?.data.content ?? "",
      image: initialProductData?.data.image ?? { size: 0, extension: "" },
      manufacturer_id: initialProductData?.data.manufacturer_id ?? 1,
      description: initialProductData?.data.description ?? "",
      drug_classification_id:
        initialProductData?.data.drug_classification_id ?? 1,
      product_category_id: initialProductData?.data.product_category_id ?? 1,
      drug_form: initialProductData?.data.drug_form ?? "",
      unit_in_pack: initialProductData?.data.unit_in_pack ?? "",
      selling_unit: initialProductData?.data.selling_unit ?? "",
      weight: initialProductData?.data.weight ?? 0,
      length: initialProductData?.data.length ?? 0,
      width: initialProductData?.data.width ?? 0,
      height: initialProductData?.data.height ?? 0,
    },
  })

  const onSubmit = async (data: ProductInputs) => {
    const { success, message } = await updateProducts(
      mode,
      data,
      initialProductData?.data.id,
    )

    success ? toast.success(message) : toast.error(message)

    router.push("/dashboard/products")
  }

  React.useEffect(() => {
    form.setFocus("name")
  }, [form])

  return (
    <>
      <div>
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
                    <Input type="text" placeholder="OBH Combi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="generic_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Generic Name</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="OBH Combi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="paracetamol" {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <FormField
                control={form.control}
                name="manufacturer_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Manufacturer</FormLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(value: string) =>
                        field.onChange(Number(value))
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="capitalize">
                          <SelectValue placeholder={String(field.value)} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {prodmanuf?.data.items?.map((option) => (
                            <SelectItem
                              key={option.id}
                              value={String(option.id)}
                              className="capitalize"
                            >
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Obat ini dapat digunakan untuk sakit kepala"
                      {...field}
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <FormField
                control={form.control}
                name="drug_classification_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Drug Classification</FormLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(value: string) =>
                        field.onChange(Number(value))
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="capitalize">
                          <SelectValue placeholder={String(field.value)} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {drugclass?.data.items?.map((option) => (
                            <SelectItem
                              key={option.id}
                              value={String(option.id)}
                              className="capitalize"
                            >
                              {option.name}
                            </SelectItem>
                          ))}
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
                name="product_category_id"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Product Category</FormLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(value: string) =>
                        field.onChange(Number(value))
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="capitalize">
                          <SelectValue placeholder={String(field.value)} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {prodcat?.data.items?.map((option) => (
                            <SelectItem
                              key={option.id}
                              value={String(option.id)}
                              className="capitalize"
                            >
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="drug_form"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Drug Form</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Capsule" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit_in_pack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit in Pack</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="selling_unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Drug Form</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Bottle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-2">
              <div className="">
                <div>
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Weight</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="in grams"
                            {...field}
                            onChange={(event) => {
                              const numericValue = +event.target.value
                              field.onChange(
                                isNaN(numericValue) ? 0 : numericValue,
                              )
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Length</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="in cm"
                            {...field}
                            onChange={(event) => {
                              const numericValue = +event.target.value
                              field.onChange(
                                isNaN(numericValue) ? 0 : numericValue,
                              )
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="">
                <FormField
                  control={form.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Width</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="in cm"
                          {...field}
                          onChange={(event) => {
                            const numericValue = +event.target.value
                            field.onChange(
                              isNaN(numericValue) ? 0 : numericValue,
                            )
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Height</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="in cm"
                          {...field}
                          onChange={(event) => {
                            const numericValue = +event.target.value
                            field.onChange(
                              isNaN(numericValue) ? 0 : numericValue,
                            )
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Image</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <>
                          <Input
                            className="hidden"
                            id="imageUpload"
                            type="file"
                            onChange={(e) => {
                              const files = e.target.files
                              if (!files) return

                              const file = files[0]
                              if (!file) return

                              field.onChange(file)
                            }}
                            accept="image/*"
                            ref={field.ref}
                            disabled={field.disabled}
                          />
                          <label htmlFor="imageUpload" className="w-full">
                            <Button
                              variant="outline"
                              className="w-full cursor-pointer font-medium"
                              asChild
                            >
                              <div>
                                <UploadCloudIcon className="mr-1.5 size-3.5 translate-y-[-1px] stroke-foreground stroke-[0.6px]" />
                                Upload
                              </div>
                            </Button>
                          </label>

                          {preview && <img src={preview} alt="" />}
                        </>
                      </FormControl>

                      {mode === "add" &&
                        form.getFieldState("image").isDirty && (
                          <img
                            src={URL.createObjectURL(field.value)}
                            alt={"Image preview"}
                          />
                        )}
                      {mode === "edit" && initialProductData && (
                        <img
                          src={
                            form.getFieldState("image").isDirty
                              ? URL.createObjectURL(field.value)
                              : initialProductData.data.image
                          }
                          alt={initialProductData.data.name}
                        />
                      )}
                    </div>
                    <UncontrolledFormMessage
                      message={form.formState.errors.image?.message?.toString()}
                    />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-fit"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                {toSentenceCase(mode)} Product
              </Button>
              {mode === "edit" && initialProductData && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-fit"
                    asChild
                  >
                    <Link
                      href={`/products/${initialProductData?.data.id}`}
                      target="_blank"
                    >
                      View product
                      <ExternalLinkIcon className="ml-1.5 size-3.5" />
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}
