import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cross2Icon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import useSWR, { type KeyedMutator } from "swr"

import type { StockMutationRequestInputs } from "@/types"
import type { PharmacyProductRequest, ResponseGetAll } from "@/types/api"
import { requestStockMutation } from "@/lib/fetchers"
import { useStore } from "@/lib/stores/stock-mutation-request"
import { cn } from "@/lib/utils"
import { stockMutationRequestSchema } from "@/lib/validations/stock-mutation"
import { Button } from "@/components/ui/button"
import { Command, CommandItem, CommandList } from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"

interface RequestPharmacyProductFormProps {
  onFormSubmit: () => void
  pharmacyProductId: number
  mutate: KeyedMutator<any>
}

export function RequestPharmacyProductForm({
  onFormSubmit,
  pharmacyProductId,
  mutate,
}: RequestPharmacyProductFormProps) {
  const pharmacyProduct = useStore((state) => state.pharmacyProduct)

  const form = useForm<StockMutationRequestInputs>({
    resolver: zodResolver(stockMutationRequestSchema),
    defaultValues: {
      pharmacy_product_origin_id: 0,
      stock: "",
    },
  })

  const onSubmit = (data: StockMutationRequestInputs) => {
    const handleSubmission = async () => {
      const { success, message } = await requestStockMutation({
        pharmacy_product_dest_id: Number(pharmacyProductId),
        ...data,
      })
      if (!success) throw new Error(message)

      await mutate()
      form.reset()
      onFormSubmit()

      return message
    }

    toast.promise(handleSubmission(), {
      loading: "Requesting stock mutation...",
      success: (message) => message,
      error: (err) => err.message,
    })
  }

  const isInvalid =
    pharmacyProduct !== null &&
    Number(form.watch("stock")) > pharmacyProduct.stock

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
              Cannot request more than the available stock
            </FormMessage>
          </FormItem>
        )}

        <FormField
          control={form.control}
          name="pharmacy_product_origin_id"
          render={({ field }) => (
            <PharmacyProductsCombobox
              pharmacyProductId={pharmacyProductId}
              value={field.value}
              onValueChange={(value) => field.onChange(+value)}
            />
          )}
        />

        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) =>
                    field.onChange(Number(e.target.value).toString())
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4 flex gap-4">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || isInvalid}
            className="w-fit"
          >
            {form.formState.isSubmitting && (
              <Icons.Spinner className="mr-2 size-4 animate-spin" />
            )}
            Request
          </Button>
        </div>
      </form>
    </Form>
  )
}

interface PharmacyProductsComboboxProps {
  pharmacyProductId: number
  value: number
  onValueChange: (value: string) => void
}

function PharmacyProductsCombobox({
  pharmacyProductId,
  value,
  onValueChange,
}: PharmacyProductsComboboxProps) {
  const [page, setPage] = React.useState(1)
  const [sort, setSort] = React.useState<"asc" | "desc" | null>(null)
  const updatePharmacyProduct = useStore((state) => state.updatePharmacyProduct)
  const pharmacyProduct = useStore((state) => state.pharmacyProduct)

  const { data, isLoading } = useSWR<ResponseGetAll<PharmacyProductRequest[]>>(
    () => {
      const params = new URLSearchParams()
      params.set("page", String(page))
      params.set("limit", "10")
      if (sort) params.set("sort_by", "stock")
      if (sort) params.set("sort", sort)

      return `/v1/pharmacy-products/${pharmacyProductId}/request?${params.toString()}`
    },
  )

  return (
    <FormItem>
      <FormLabel>Sender</FormLabel>
      <div className="flex justify-between rounded-md border p-4">
        {pharmacyProduct ? (
          <div className="flex flex-col text-sm">
            {pharmacyProduct.pharmacy.name}
            <span className="text-muted-foreground">
              Available stock:&nbsp;
              <span className="font-semibold">{pharmacyProduct.stock}</span>
            </span>
          </div>
        ) : (
          <div className="flex flex-col text-sm leading-10 text-muted-foreground">
            No pharmacy selected
          </div>
        )}
      </div>
      <Command shouldFilter={false} className="h-[300px] rounded-md border">
        <CommandList aria-label="Pharmacies" className="max-h-none">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div className="p-[10px]" key={i}>
                <Skeleton className="h-[53px] w-full" />
              </div>
            ))}
          {data?.data.items.length === 0 && (
            <div className="p-4 text-center text-sm leading-10">
              No pharmacies found
            </div>
          )}
          {!isLoading &&
            data?.data.items.map((product) => (
              <CommandItem
                key={product.id}
                value={String(product.id)}
                className="flex items-center justify-between border-b p-4 last:border-0 hover:cursor-pointer"
                onSelect={(value) => {
                  onValueChange(value)

                  const currPharmacyProduct = data.data.items.find(
                    (p) => p.id === +value,
                  )

                  if (currPharmacyProduct) {
                    updatePharmacyProduct(currPharmacyProduct)
                  }
                }}
              >
                <div className="flex flex-col">
                  {product.pharmacy.name}
                  <span className="text-muted-foreground">
                    Available stock:&nbsp;
                    <span className="font-semibold">{product.stock}</span>
                  </span>
                </div>
                <div className="flex gap-2">
                  <CheckIcon
                    className={cn(
                      "size-4",
                      value !== product.id && "invisible",
                    )}
                  />
                </div>
              </CommandItem>
            ))}
        </CommandList>
      </Command>
      <div className="flex justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 data-[state=open]:bg-accent"
            >
              <span>Sort</span>
              {sort === "desc" ? (
                <ArrowDownIcon className="ml-2 size-4" />
              ) : sort === "asc" ? (
                <ArrowUpIcon className="ml-2 size-4" />
              ) : (
                <CaretSortIcon className="ml-2 size-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top">
            <DropdownMenuItem onSelect={() => setSort("asc")}>
              <ArrowUpIcon className="mr-2 size-3.5 text-muted-foreground/70" />
              Asc
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setSort("desc")}>
              <ArrowDownIcon className="mr-2 size-3.5 text-muted-foreground/70" />
              Desc
            </DropdownMenuItem>
            {sort && (
              <DropdownMenuItem onClick={() => setSort(null)}>
                <Cross2Icon className="mr-2 size-3.5 text-muted-foreground/70" />
                Reset
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div>
          <Button
            variant="outline"
            size="icon"
            className="size-9"
            disabled={page === 1}
            onClick={() =>
              setPage((prev) => {
                if (prev === 1) return prev
                return prev - 1
              })
            }
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-9"
            disabled={data?.data.total_pages === page}
            onClick={() =>
              setPage((prev) => {
                if (data?.data.total_pages === prev) return prev
                return prev + 1
              })
            }
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>
      <FormMessage />
    </FormItem>
  )
}
