import type { z } from "zod"

import type { PharmacyInputs } from "@/types"
import type { Message } from "@/types/websocket"
import type { consultationSessionStatusIds, usersRoleIds } from "@/config"
import type { manufacturersSchema } from "@/lib/validations/manufacturers-schema"
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
  city_id: number
  province_id: number
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

// GET /v1/pharmacy-products/:id/request

export type PharmacyProductRequest = Omit<
  PharmacyProduct,
  "is_active" | "product"
> & {
  pharmacy: Pharmacy
}

// GET /v1/users/:id

export type User = {
  id: number
  email: string
  user_role_id: keyof typeof usersRoleIds
  is_verified: boolean
}

// GET /v1/report-stock-mutations?pharmacy_id=1

export type StockMutationReport = {
  id: number
  pharmacy_product_id: number
  product_stock_mutation_type_id: number
  stock: number
  pharmacy_product: {
    product: Pick<IProduct, "name" | "generic_name" | "content"> & {
      manufacturer: Pick<IManufacturer, "name">
    }
  }
  product_stock_mutation_type: {
    name: string
  }
  mutation_date: string
}

// /v1/address-area Response

export type AddressResponse<TData = unknown> = {
  data: TData
}

// GET /v1/address-area/provinces/no-params

export type Province = {
  province_id: number
  province: string
}

// GET /v1/address-area/cities/no-params

export type City = {
  province_id: number
  city_id: number
  city_name: string
}

// GET /v1/stock-mutations/requests/out

export type Request = {
  id: number
  pharmacy_product_origin_id: number
  pharmacy_product_dest_id: number
  stock: number
  product_stock_mutation_request_status_id: 1 | 2 | 3
  product_stock_mutation_request_status: {
    name: string
  }
  request_date: string
}

export type OutgoingRequest = Request & {
  pharmacy_product_origin: {
    pharmacy: Pick<Pharmacy, "name">
    product: Pick<IProduct, "name" | "generic_name" | "content"> & {
      manufacturer_id: number
      manufacturer: Omit<IManufacturer, "id">
    }
  }
}

// GET /v1/stock-mutations/requests/in

export type IncomingRequest = Request & {
  pharmacy_product_dest: {
    pharmacy: {
      name: string
    }
    product: Pick<IProduct, "name" | "generic_name" | "content"> & {
      manufacturer_id: number
      manufacturer: Omit<IManufacturer, "id">
    }
  }
}

// GET /v1/products/admin

export type Product = Omit<
  IProduct,
  "created_at" | "updated_at" | "minimum_price" | "maximum_price"
>

// GET /v1/sick-leave-forms/:session_id

export type SickLeaveForm = {
  id: number
  session_id: number
  starting_date: string
  ending_date: string
  description: string
  updated_at: string
  created_at: string
  prescription: Pick<Prescription, "symptoms" | "diagnosis">
  user: {
    email: string
    name: string
    date_of_birth: string
  }
  doctor: {
    email: string
    name: string
    doctor_specialization: string
  }
}

// GET /v1/prescriptions/:session_id

export type PrescriptionProduct = {
  id: number
  product_id: number
  note: string
  created_at: string
  updated_at: string
  product: {
    id: number
    name: string
    generic_name: string
    content: string
    image: string
    manufacturer: {
      name: string
      image: string
    }
  }
}

export type Prescription = {
  id: number
  session_id: number
  symptoms: string
  diagnosis: string
  created_at: string
  updated_at: string
  prescription_products: PrescriptionProduct[]
}

// GET /v1/chats

export type ChatRoomUser = {
  user_id: number
  name: string
  profile_photo: string
}

export type ChatRoom = {
  id: number
  user_id: number
  doctor_id: number
  consultation_session_status_id: keyof typeof consultationSessionStatusIds
  created_at: string
  updated_at: string
  consultation_session_status: {
    name: (typeof consultationSessionStatusIds)[keyof typeof consultationSessionStatusIds]
  }
  user: ChatRoomUser
  doctor: ChatRoomUser
  messages: Message[]
  sick_leave_form?: Omit<SickLeaveForm, "prescription" | "user" | "doctor">
  prescription?: Prescription
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

export type ManufacturersSchema = {
  data: {
    id: number
  } & z.infer<typeof manufacturersSchema>
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
  image?: string
  name: string
}
export interface IProductCategory {
  id: number
  name: string
}

export interface ICart {
  id: number
  user_id: number
  product_id: number
  quantity: number
  product: IProduct
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
  minimum_price: string
  maximum_price: string
}

export type AddressI = Omit<
  PharmacyInputs,
  | "operationalDays"
  | "closesAt"
  | "opensAt"
  | "pharmacistPhone"
  | "pharmacistName"
  | "pharmacistLicense"
  | "operational_hours_open"
  | "operational_hours_close"
>

export interface IProfileUser {
  id: number
  email: string
  user_role_id: number
  is_verified: boolean
  name: string
  profile_photo: string
  date_of_birth: string
}

export interface IProfileDoctor {
  id: number
  email: string
  user_role_id: number
  is_verified: boolean
  name: string
  profile_photo: string
  starting_year: number
  doctor_certificate: string
  doctor_specialization: Specialization
  consultation_fee: string
  is_online: boolean
}

export interface AddressIForm {
  id: string
  name: string
  address: string
  sub_district: string
  district: string
  city_id: number
  province_id: number
  postal_code: string
  latitude: string
  longitude: string
  status: number
}

export type Specialization = {
  id: number
  name: string
  image: string
}

export type CheckoutResponse<TData = unknown> = {
  total_items: number
  total_pages: number
  current_page_total_items: number
  current_page: number
  items: TData
}

export interface ICheckout {
  id: number
  user_id: number
  quantity: number
  product: IProduct & IManufacturer & IDrugClassification & IProductCategory
  pharmacy_product: Omit<PharmacyProduct, "product">
}

export interface IShippingMethod {
  id: number
  name: string
  cost: string
}

export type Order = {
  shipping_method_id: number
  shipping_cost: string
  order_details: CheckoutItem[]
}

export type CheckoutItem = {
  pharmacy_product_id: number
  quantity: number
}

export interface ITransaction {
  id: number
  date: Date
  payment_proof: string
  payment_method: string
  address: string
  total_payment: string
  transaction_status: ITransactionStatus
  orders: IOrder[]
}

export interface IOrder {
  pharmacy_name: string
  shipping_method: string
  shipping_cost: string
  total_payment: string
  order_details: IOrderDetail[]
}

export type ITransactionConfirmation = {
  total_payment: string
  transaction_status_id: number
}

export interface IOrderDetail {
  name: string
  generic_name: string
  content: string
  description: string
  image: string
  price: string
  quantity: number
}

export interface ITransactionStatus {
  id: number
  name: string
}

export interface IPharmacySalesReportByMonth {
  month: number
  total_sell: number
}

export interface IPharmacySalesReportByPharmacy {
  year: string
  pharmacy_admin_email: string
  pharmacy_id: number
  pharmacy_name: string
  total_sells: number
}

export interface doctorI {
  id: number
  email: string
  user_role_id: number
  is_verified: boolean
  name: string
  profile_photo: string
  starting_year: number
  doctor_certificate: string
  doctor_specialization?: Specialization
  consultation_fee: string
  is_online: boolean
}

export interface OrderWithStatusI {
  id: number
  Pharmacy: PharmacyOrderI
  date: Date
  no_of_items: number
  total_payment: string
  transaction_id: number
  Status: OrderStatusI
}

export interface DetailOrderPageI {
  id: number
  order_status: OrderStatusI
  date: string
  shippingMethod: Omit<IShippingMethod, "cost">
  shipping_cost: string
  pharmacy: PharmacyOrderI
  user_address: string
  order_details: IOrderDetail[]
}

export interface PharmacyOrderI {
  id: number
  name: string
}

export interface OrderStatusI {
  id: string
  name: string
}

interface StatusOrder {
  id: number
  name: string
}

export interface IOrderResponse {
  id: number
  Pharmacy: Pick<Pharmacy, "id" | "name">
  date: Date
  no_of_items: number
  total_payment: string
  transaction_id: number
  Status: StatusOrder
}
