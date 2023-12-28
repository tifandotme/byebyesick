import type { z } from "zod"

import type { productSchema } from "@/lib/validations/products"
import type { Icons } from "@/components/icons"

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

export type ProductInputs = z.infer<typeof productSchema>

export type Response<TData = unknown> = {
  success: boolean
  message: string
  data?: TData
}
