import React from "react"
import { useRouter } from "next/router"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { ProductInputs } from "@/types"
import type { Products } from "@/types/api"
import { productSchema } from "@/lib/validations/products"

interface ProductFormProps {
  mode: "add" | "edit"
  initialData?: Products
}

export default function ProductForm({ mode, initialData }: ProductFormProps) {
  const router = useRouter()
  const form = useForm<ProductInputs>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      content: initialData?.content ?? "",
      image: initialData?.image ?? "",
      isPremium: initialData?.isPremium ?? false,
    },
  })
  return <div>AddProductForm</div>
}
