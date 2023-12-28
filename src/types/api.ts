// GET /users/:id

import type { z } from "zod"

import type { productSchema } from "@/lib/validations/products"

export type User = {
  id: number
  role: "admin" | "user" | "pharmacy_admin" | "doctor"
  name: string
  email: string
  password: string
}

export type Products = {
  id: number
  slug: string
  createdAt: string
  updatedAt: string
  likers: User["id"][]
  shareCount: number
} & z.infer<typeof productSchema>

// GET ...
