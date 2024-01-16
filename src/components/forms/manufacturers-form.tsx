/* eslint-disable @next/next/no-img-element */

import React from "react"
import { useRouter } from "next/router"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, UploadCloudIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type { ManufacturersInput } from "@/types"
import type { ManufacturersSchema } from "@/types/api"
import { updateManufacturers } from "@/lib/fetchers"
import { toSentenceCase } from "@/lib/utils"
import { manufacturersSchema } from "@/lib/validations/manufacturers-schema"
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

interface ManufacturersFormProps {
  mode: "add" | "edit"
  initialProductData?: ManufacturersSchema
}

export default function ManufacturersForm({
  mode,
  initialProductData,
}: ManufacturersFormProps) {
  const router = useRouter()

  const form = useForm<ManufacturersInput>({
    resolver: zodResolver(manufacturersSchema),
    defaultValues: {
      image: initialProductData?.data.image ?? "",
      name: initialProductData?.data.name ?? "",
    },
  })

  const onSubmit = async (data: ManufacturersInput) => {
    const { success, message } = await updateManufacturers(
      mode,
      data,
      initialProductData?.data.id,
    )
    success ? toast.success(message) : toast.error(message)

    router.push("/dashboard/manufacturers")
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
                                <UploadCloudIcon className="mr-1.5 h-3.5 w-3.5 translate-y-[-1px] stroke-foreground stroke-[0.6px]" />
                                Upload
                              </div>
                            </Button>
                          </label>
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Add your manufacturers name here..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-fit"
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {toSentenceCase(mode)} Manufacturers
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}
