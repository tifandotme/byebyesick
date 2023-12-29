// GET /users/:id

import type { z } from "zod"

import type { productCategoriesSchema } from "@/lib/validations/product-categories-schema"
import type { productSchema } from "@/lib/validations/products-schema"

export type User = {
  id: number
  role: "admin" | "user" | "pharmacy_admin" | "doctor"
  name: string
  email: string
  password: string
}

export type Products = {
  id: number
} & z.infer<typeof productSchema>

export type ProductsResponse = {
  total_items?: number
  total_pages?: number
  current_page_total_items?: number
  current_page?: number
  items: Item[]
}

// GET ALL PRODUCTS AND PRODUCTS/:ID

export type Item = {
  id: number
  name: string
  generic_name: string
  content: string
  manufacturer_id: number
  description: string
  drug_classification_id: number
  product_category_id: number
  drug_form: string
  unit_in_pack: string
  selling_unit: string
  weight: number
  length: number
  width: number
  height: number
  image: string
  price: string
  created_at: Date
  updated_at: Date
}

// GET ALL PRODUCT CATEGORIES

export type ProductsCategories = {
  id: number
} & z.infer<typeof productCategoriesSchema>

export type ProductCategoriesResponse = {
  data: Categories[]
}

export type Categories = {
  id: number
  name: string
}
