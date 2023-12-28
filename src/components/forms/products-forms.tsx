import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { zodResolver } from "@hookform/resolvers/zod"
import { ExternalLinkIcon } from "@radix-ui/react-icons"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type { ProductInputs } from "@/types"
import type { Products } from "@/types/api"
import { updatePost } from "@/lib/fetchers"
import { toSentenceCase } from "@/lib/utils"
import { productSchema } from "@/lib/validations/products"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ProductFormProps {
  mode: "add" | "edit"
  initialData?: Products
}

export default function ProductForm({ mode, initialData }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<ProductInputs>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      content: initialData?.content ?? "",
      image: initialData?.image ?? "",
      isPremium: initialData?.isPremium ?? false,
    },
  })

  const onSubmit = async (data: ProductInputs) => {
    setIsLoading(true)

    const { success, message } = await updatePost(mode, data, initialData?.id)
    success ? toast.success(message) : toast.error(message)

    setIsLoading(false)

    router.push("/dashboard/posts")
  }

  React.useEffect(() => {
    form.setFocus("title")
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Where Great Ideas Begin"
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
                      placeholder="Unleash your ideas here..."
                      {...field}
                      rows={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <div className="flex flex-col items-start gap-6 sm:flex-row">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Category</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value: typeof field.value) =>
                        field.onChange(value)
                      }
                    >
                      <FormControl>
                        <SelectTrigger className="capitalize">
                          <SelectValue placeholder={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {postCategories.map((option) => (
                            <SelectItem
                              key={option}
                              value={option}
                              className="capitalize"
                            >
                              {option}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

                              form.setValue(
                                "image",
                                URL.createObjectURL(file),
                                {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                },
                              )
                            }}
                            accept="image/*"
                            ref={field.ref}
                            disabled={field.disabled}
                          />
                          <label htmlFor="imageUpload" className="w-full">
                            <Button
                              variant="outline"
                              className="w-full font-medium cursor-pointer"
                              asChild
                            >
                              <div>
                                <UploadIcon className="mr-1.5 h-3.5 w-3.5 translate-y-[-1px] stroke-foreground stroke-[0.6px]" />
                                Upload
                              </div>
                            </Button>
                          </label>
                        </>
                      </FormControl>
                      {mode === "add" &&
                        form.getFieldState("image").isDirty && (
                          <ViewImageButton
                            src={field.value}
                            alt={"Image preview"}
                          />
                        )}
                      {mode === "edit" && initialData && (
                        <ViewImageButton
                          src={
                            form.getFieldState("image").isDirty
                              ? field.value
                              : initialData.image
                          }
                          alt={initialData.title}
                        />
                      )}
                    </div>
                    <UncontrolledFormMessage
                      message={form.formState.errors.image?.message}
                    />
                  </FormItem>
                )}
              />
            </div> */}
            <FormField
              control={form.control}
              name="isPremium"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Premium ✨</FormLabel>
                    <FormDescription>
                      Posts marked as premium will only be available to
                      subscribed users.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading} className="w-fit">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {toSentenceCase(mode)} post
              </Button>
              {mode === "edit" && initialData && (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-fit"
                    asChild
                  >
                    <Link href={`/${initialData?.slug}`} target="_blank">
                      View Post
                      <ExternalLinkIcon className="ml-1.5 h-3.5 w-3.5" />
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
