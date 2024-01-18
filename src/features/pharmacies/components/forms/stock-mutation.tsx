import { zodResolver } from "@hookform/resolvers/zod"
import {
  ExclamationTriangleIcon,
  MinusIcon,
  PlusIcon,
} from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import type { KeyedMutator } from "swr"

import type { StockMutationInputs } from "@/types"
import { addStockMutation } from "@/lib/fetchers"
import { stockMutationSchema } from "@/lib/validations/stock-mutation"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogFooter } from "@/components/ui/dialog"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"

interface StockMutationFormProps {
  onFormSubmit: () => void
  pharmacyProductId: number
  mutate: KeyedMutator<any>
  currStock: number
}

export function StockMutationForm({
  onFormSubmit,
  pharmacyProductId,
  mutate,
  currStock,
}: StockMutationFormProps) {
  const form = useForm<StockMutationInputs>({
    resolver: zodResolver(stockMutationSchema),
    defaultValues: {
      product_stock_mutation_type_id: 1,
      stock: "",
    },
  })

  const onSubmit = (data: StockMutationInputs) => {
    const handleSubmission = async () => {
      const { success, message } = await addStockMutation({
        pharmacy_product_id: pharmacyProductId,
        ...data,
      })
      if (!success) throw new Error(message)

      await mutate()
      form.reset()
      onFormSubmit()

      return message
    }

    toast.promise(handleSubmission(), {
      loading: "Applying stock mutation...",
      success: (message) => message,
      error: (err) => err.message,
    })
  }

  const isInvalid =
    Number(form.watch("stock")) > currStock &&
    form.watch("product_stock_mutation_type_id") === 2

  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-2xl gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {isInvalid && (
          <FormItem>
            <FormMessage className="inline-flex items-center gap-2">
              <ExclamationTriangleIcon className="size-3.5" />
              Cannot subtract more than current stock
            </FormMessage>
          </FormItem>
        )}

        <FormItem>
          <FormLabel>Current stock</FormLabel>
          <div className="text-xl tabular-nums">
            {currStock.toLocaleString("id-ID")}
          </div>
        </FormItem>

        <FormField
          control={form.control}
          name="product_stock_mutation_type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <div className="flex justify-stretch gap-2 [&>*]:w-full">
                <Toggle
                  onPressedChange={() => field.onChange(1)}
                  pressed={field.value === 1}
                >
                  <PlusIcon className="size-4" aria-label="Addition" />
                </Toggle>
                <Toggle
                  onPressedChange={() => field.onChange(2)}
                  pressed={field.value === 2}
                >
                  <MinusIcon className="size-4" aria-label="Deduction" />
                </Toggle>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <Input
                type="number"
                {...field}
                onChange={(e) => {
                  field.onChange(Number(e.target.value).toString())
                }}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" type="button" onClick={() => form.reset()}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" className="w-fit" disabled={isInvalid}>
            Apply
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
