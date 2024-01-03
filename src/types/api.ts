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
