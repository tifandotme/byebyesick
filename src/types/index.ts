import type { z } from "zod"

import type { addressSchema } from "@/lib/validations/address"
import type cartSchema from "@/lib/validations/cart-schema"
import type {
  certificateSchema,
  chatRoomSchema,
  prescriptionSchema,
} from "@/lib/validations/consultation"
import type { manufacturersSchema } from "@/lib/validations/manufacturers-schema"
import type {
  pharmacyProductSchema,
  pharmacySchema,
} from "@/lib/validations/pharmacies"
import type { productCategoriesSchema } from "@/lib/validations/product-categories-schema"
import type { productSchema } from "@/lib/validations/products-schema"
import type {
  newPasswordScheme,
  resetPasswordEmailScheme,
} from "@/lib/validations/reset-password"
import type {
  stockMutationRequestSchema,
  stockMutationSchema,
} from "@/lib/validations/stock-mutation"
import type { userSchema } from "@/lib/validations/user"
import type { Icons } from "@/components/icons"

import type { CheckoutItem, Order } from "./api"

/**
 * Used in custom fetchers and API routes
 */
export type Response<TData = unknown> = {
  success: boolean
  message?: string
  data?: TData
}

export type Option = {
  label: string
  value: string
}

export interface DataTableFilterableColumn<TData> {
  id: keyof TData
  title: string
  options: Option[]
}

export interface FooterItem {
  title: string
  items: {
    title: string
    href: string
    external?: boolean
  }[]
}

export interface NavItem {
  title: string
  href?: string
  icon?: keyof typeof Icons
  description?: string
}

export type NavItemRequired = Required<Omit<NavItem, "description">>

export interface NavItemRequiredWithRole extends NavItemRequired {
  role: string[]
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithOptionalChildren[]
}

export type MainNavItem = NavItemWithOptionalChildren

export type SidebarNavItem = NavItemRequiredWithRole

export type PharmacyInputs = z.infer<typeof pharmacySchema>

export type PharmacyProductInputs = z.infer<typeof pharmacyProductSchema>

export type UserInputs = z.infer<typeof userSchema>

export type ProductInputs = z.infer<typeof productSchema>

export type StockMutationInputs = z.infer<typeof stockMutationSchema>

export type chatRoomInputs = z.infer<typeof chatRoomSchema>

export type CertificateInputs = z.infer<typeof certificateSchema>

export type PrescriptionInputs = z.infer<typeof prescriptionSchema>

export type StockMutationRequestInputs = z.infer<
  typeof stockMutationRequestSchema
>

export type ProductCategoriesInputs = z.infer<typeof productCategoriesSchema>

export type ManufacturersInput = z.infer<typeof manufacturersSchema>

export type AddressFormSchemaType = z.infer<typeof addressSchema>

export type CartInputs = z.infer<typeof cartSchema>

export type ResetPasswordEmailSchemeType = z.infer<
  typeof resetPasswordEmailScheme
>
export type NewPasswordEmailSchemeType = z.infer<typeof newPasswordScheme>

export type CheckoutInput = {
  address_id: number
  checkout_items: CheckoutItem[]
}

export type TransactionInput = {
  address_id: number
  total_payment: string
  orders: Order[]
}
