import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import useSWR from "swr"

import type { PrescriptionInputs } from "@/types"
import {
  type Prescription,
  type Product,
  type ResponseGetAll,
} from "@/types/api"
import { updatePrescription } from "@/lib/fetchers"
import { cn } from "@/lib/utils"
import { prescriptionSchema } from "@/lib/validations/consultation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"

interface PrescriptionFormProps {
  mode: "add" | "edit"
  initialData?: Prescription
  onFormSubmit: () => void
  sessionId: number
}

export function PrescriptionForm({
  mode,
  initialData,
  onFormSubmit,
  sessionId,
}: PrescriptionFormProps) {
  const form = useForm<PrescriptionInputs>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      symptoms: initialData?.symptoms ?? "",
      diagnosis: initialData?.diagnosis ?? "",
      prescription_products: initialData?.prescription_products.length
        ? initialData.prescription_products.map((product) => ({
            product_id: product.product_id,
            product_name: product.product.name,
            note: product.note,
          }))
        : [],
    },
  })

  const onSubmit = (data: PrescriptionInputs) => {
    if (form.getValues("prescription_products").length === 0) {
      form.setError("prescription_products", {
        type: "manual",
        message: "Add atleast one product",
      })
      return
    }

    const handleSubmission = async () => {
      const { success, message } = await updatePrescription(
        mode,
        {
          session_id: sessionId,
          ...data,
        },
        sessionId,
      )
      if (!success) throw new Error(message)

      form.reset()
      onFormSubmit()

      return message
    }

    toast.promise(handleSubmission(), {
      loading: "Updating prescription...",
      success: (message) => message,
      error: (err) => err.message,
    })
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-2xl gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="symptoms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symptoms</FormLabel>
              <Textarea {...field} className="w-full p-3" rows={2} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="diagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diagnosis</FormLabel>
              <Textarea {...field} className="w-full p-3" rows={2} />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Medicines</FormLabel>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {form.watch("prescription_products").map((product) => (
              <li key={product.product_id} className="flex flex-col">
                <span className="font-bold">{product.product_name}</span>
                <span>Note: {product.note}</span>
              </li>
            ))}
          </ul>
          {form.formState.errors.prescription_products?.message && (
            <UncontrolledFormMessage
              message={form.formState.errors.prescription_products.message}
            />
          )}
        </FormItem>

        {form.watch("prescription_products").length > 0 && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              form.setValue("prescription_products", [])
            }}
          >
            Clear All
          </Button>
        )}

        <ProductsCombobox
          onSubmit={(productId, note, productName) => {
            if (
              form
                .getValues("prescription_products")
                .some((product) => product.product_id === productId)
            ) {
              toast.error("Product already exists")
              return
            }

            form.clearErrors("prescription_products")

            form.setValue("prescription_products", [
              ...form.getValues("prescription_products"),
              {
                product_id: productId,
                product_name: productName,
                note,
              },
            ])
          }}
        />

        <Button type="submit" className="w-fit">
          Submit
        </Button>
      </form>
    </Form>
  )
}

interface ProductsComboboxProps {
  onSubmit: (productId: number, note: string, productName: string) => void
}

function ProductsCombobox({ onSubmit }: ProductsComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [productId, setProductId] = React.useState("0")
  const [note, setNote] = React.useState("")

  const { data, isLoading } = useSWR<ResponseGetAll<Product[]>>(
    "/v1/products/global",
  )

  const entries = data?.data.items.map((product) => ({
    label: product.name,
    value: String(product.id),
  }))

  return (
    <Card>
      <CardHeader className="!p-4 text-sm font-semibold">Add</CardHeader>
      <CardContent className="space-y-2 !p-4 !pt-0 text-sm font-semibold">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                className={cn(
                  "w-full max-w-[350px] justify-between rounded-md !border-input px-3 font-medium hover:!bg-muted hover:!text-foreground",
                )}
                disabled={isLoading}
              >
                {productId !== "0" && entries
                  ? entries.find((entry) => entry.value === productId)?.label
                  : `Select product`}
                <ChevronDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
            <Command>
              <CommandInput placeholder={`Search products...`} />
              <CommandEmpty>No products found.</CommandEmpty>
              <CommandGroup className="max-h-[200px] overflow-y-auto">
                {entries?.map((entry) => (
                  <CommandItem
                    value={entry.label}
                    key={entry.value}
                    onSelect={() => {
                      setProductId(entry.value)
                      setOpen(false)
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 size-4",
                        entry.value === productId ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {entry.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        <Input
          type="text"
          onChange={(e) => {
            setNote(e.target.value)
          }}
          placeholder="Insert note, ie. 1 tablet per day"
          value={note}
          className="w-full max-w-[350px]"
        />
        <Button
          type="button"
          variant="secondary"
          disabled={productId === "0" || note === ""}
          onClick={(e) => {
            e.preventDefault()
            onSubmit(
              Number(productId),
              note,
              entries?.find((entry) => entry.value === productId)?.label ?? "",
            )
            setProductId("0")
            setNote("")
          }}
          className="w-fit px-5"
        >
          Add
        </Button>
      </CardContent>
    </Card>
  )
}
