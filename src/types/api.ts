import type { z } from "zod"

import type { usersRoleIds } from "@/config"
import type { productCategoriesSchema } from "@/lib/validations/product-categories-schema"
import type { productSchema } from "@/lib/validations/products-schema"

export type ResponseGetAll<TData = unknown> = {
  data: {
    total_items: number
    total_pages: number
    current_page_total_items: number
    current_page: number
    items: TData
  }
  errors?: string[]
}

export type ResponseById<TData = unknown> = {
  data: TData
  errors?: string[]
}

// GET /v1/pharmacies/:id

export type Pharmacy = {
  id: number
  pharmacy_admin_id: number
  name: string
  address: string
  sub_district: string
  district: string
  city: string
  province: string
  postal_code: string
  latitude: string
  longitude: string
  pharmacist_name: string
  pharmacist_license_no: string
  pharmacist_phone_no: string
  operational_hours_open: number
  operational_hours_close: number
  operational_days: string[]
}

// GET /v1/pharmacy-products?pharmacy_id=1

export type PharmacyProduct = {
  id: number
  pharmacy_id: number
  product_id: number
  is_active: boolean
  price: string
  stock: number
  product: IProduct & {
    manufacturer: Omit<IManufacturer, "id">
    drug_classification: Omit<IDrugClassification, "id">
    product_category: Omit<IProductCategory, "id">
  }
}

// GET /v1/pharmacy-products/:id

export type PharmacyProductById = Omit<PharmacyProduct, "product">

// GET /v1/users/:id

export type User = {
  id: number
  email: string
  user_role_id: keyof typeof usersRoleIds
  is_verified: boolean
}

// FOR SCHEMAS
export type ProductsSchema = {
  data: {
    id: number
  } & z.infer<typeof productSchema>
}

export type ProductsCategoriesSchema = {
  data: {
    id: number
  } & z.infer<typeof productCategoriesSchema>
}

// FOR REAL BACKEND USES

export interface ApiResponse<T> {
  data: {
    total_items?: number
    total_pages?: number
    current_page_total_items?: number
    current_page?: number
    items: T
  }
  errors: string[]
}

export interface IDrugClassification {
  id: number
  name: string
}

export interface IManufacturer {
  id: number
  name: string
}
export interface IProductCategory {
  id: number
  name: string
}
export interface IProduct {
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
  created_at: string
  updated_at: string
}

export type AddressI = {
  id: number
  name: string
  address: string
  sub_district: string
  district: string
  city: string
  province: string
  postal_code: string
  latitude: string
  longitude: string
}
