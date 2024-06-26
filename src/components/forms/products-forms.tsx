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
  FormDescription,
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
      weight: initialProductData?.data.weight ?? "",
      length: initialProductData?.data.length ?? "",
      width: initialProductData?.data.width ?? "",
      height: initialProductData?.data.height ?? "",
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
                    <Input
                      type="text"
                      placeholder="Your product name"
                      {...field}
                    />
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
                    <Input
                      type="text"
                      placeholder="Your generic product name"
                      {...field}
                    />
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
                    <Textarea
                      placeholder="Your product's ingredients"
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
                      placeholder="Description for your product"
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
                    <Input
                      type="text"
                      placeholder="Your product's form"
                      {...field}
                    />
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
                    <Input
                      type="text"
                      placeholder="Your product's unit in a pack"
                      {...field}
                    />
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
                  <FormLabel>Selling Unit</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Your selling unit product. Ex: Bottle"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-2">
              <div className="w-full">
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
                          onChange={(e) =>
                            field.onChange(Number(e.target.value).toString())
                          }
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-primary">
                        *Please input in grams
                      </FormDescription>
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
                          onChange={(e) =>
                            field.onChange(Number(e.target.value).toString())
                          }
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-primary">
                        *Please input in cm
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="width"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Width</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="in cm"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value).toString())
                          }
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-primary">
                        *Please input in cm
                      </FormDescription>
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
                          type="text"
                          placeholder="in cm"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value).toString())
                          }
                        />
                      </FormControl>
                      <FormDescription className="text-sm text-primary">
                        *Please input in cm
                      </FormDescription>
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
                        </>
                      </FormControl>
                    </div>
                    <div className="mt-8">
                      {mode === "add" &&
                        form.getFieldState("image").isDirty &&
                        field.value.type.startsWith("image/") && (
                          <img
                            src={URL.createObjectURL(field.value)}
                            alt={"Image preview"}
                          />
                        )}
                      {mode === "edit" &&
                        initialProductData &&
                        form.getFieldState("image").isDirty &&
                        field.value.type.startsWith("image/") && (
                          <img
                            src={URL.createObjectURL(field.value)}
                            alt={initialProductData.data.name}
                          />
                        )}
                      {mode === "edit" &&
                        initialProductData &&
                        !form.getFieldState("image").isDirty && (
                          <img
                            src={initialProductData.data.image}
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
