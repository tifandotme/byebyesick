import type { z } from "zod"

import type cartSchema from "@/lib/validations/cart-schema"
import type { pharmacySchema } from "@/lib/validations/pharmacy"
import type { productCategoriesSchema } from "@/lib/validations/product-categories-schema"
import type { productSchema } from "@/lib/validations/products-schema"
import type { userSchema } from "@/lib/validations/user"
import type { Icons } from "@/components/icons"

export type Response<TData = unknown> = {
  success: boolean
  message?: string
  data?: TData
}

export interface Option {
  label: string
  value: string
}

export interface DataTableSearchableColumn<TData> {
  id: keyof TData
  title: string
}

export interface DataTableFilterableColumn<TData>
  extends DataTableSearchableColumn<TData> {
  options: Option[]
}

export type SiteConfig = {
  name: string
  description: string
}

export type NavItem = {
  title: string
  href: string
  icon?: keyof typeof Icons
}

export type DashboardConfig = {
  sidebarNav: NavItem[]
  sidebarNavAdmin: NavItem[]
}

export type PharmacyInputs = z.infer<typeof pharmacySchema>

export type UserInputs = z.infer<typeof userSchema>

export type ProductInputs = z.infer<typeof productSchema>

export type ProductCategoriesInputs = z.infer<typeof productCategoriesSchema>

export type CartInputs = z.infer<typeof cartSchema>
