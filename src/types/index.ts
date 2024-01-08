import type { z } from "zod"

import type {
  pharmacyProductSchema,
  pharmacySchema,
} from "@/lib/validations/pharmacies"
import type { productCategoriesSchema } from "@/lib/validations/product-categories-schema"
import type { productSchema } from "@/lib/validations/products-schema"
import type { userSchema } from "@/lib/validations/user"
import type { Icons } from "@/components/icons"

/**
 * Used in API routes and custom fetchers
 */
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

export type PharmacyProductInputs = z.infer<typeof pharmacyProductSchema>

export type UserInputs = z.infer<typeof userSchema>

export type ProductInputs = z.infer<typeof productSchema>

export type ProductCategoriesInputs = z.infer<typeof productCategoriesSchema>
