export type Response<TData = unknown> = {
  rajaongkir: {
    results: TData
  }
}

// GET https://api.rajaongkir.com/starter/province

export type Province = {
  province_id: string
  province: string
}

// GET https://api.rajaongkir.com/starter/city

export type City = {
  city_id: string
  province_id: string
  province: string
  type: string
  city_name: string
  postal_code: string
}
