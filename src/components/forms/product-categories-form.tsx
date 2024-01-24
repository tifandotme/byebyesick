import React from "react"
import { useRouter } from "next/router"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type { ProductCategoriesInputs } from "@/types"
import type { ProductsCategoriesSchema } from "@/types/api"
import { updateProductCategory } from "@/lib/fetchers"
import { toSentenceCase } from "@/lib/utils"
import { productCategoriesSchema } from "@/lib/validations/product-categories-schema"
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

interface ProductCategoryFormProps {
  mode: "add" | "edit"
  initialProductData?: ProductsCategoriesSchema
}

export default function ProductCategoriesForm({
  mode,
  initialProductData,
}: ProductCategoryFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const form = useForm<ProductCategoriesInputs>({
    resolver: zodResolver(productCategoriesSchema),
    defaultValues: {
      name: initialProductData?.data.name ?? "",
    },
  })

  const onSubmit = async (data: ProductCategoriesInputs) => {
    setIsLoading(true)

    const { success, message } = await updateProductCategory(
      mode,
      data,
      initialProductData?.data.id,
    )
    success ? toast.success(message) : toast.error(message)

    setIsLoading(false)

    router.push("/dashboard/productcategories")
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
                    <Input type="text" placeholder="Obat" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading} className="w-fit">
                {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
                {toSentenceCase(mode)} product category
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}
