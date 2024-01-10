import { getSession } from "next-auth/react"
import useSWR, { mutate } from "swr"

import type {
  CartInputs,
  PharmacyInputs,
  PharmacyProductInputs,
  ProductCategoriesInputs,
  ProductInputs,
  Response,
  StockMutationInputs,
  UserInputs,
} from "@/types"
import type {
  ICart,
  IDrugClassification,
  IManufacturer,
  IProduct,
  IProductCategory,
  Pharmacy,
  PharmacyProduct,
  ResponseGetAll,
} from "@/types/api"
import { handleFailedRequest } from "@/lib/utils"

const BASE_URL = process.env.NEXT_PUBLIC_DB_URL as string

/**
 * Generic fetcher for `swr`
 */
export async function fetcher<TData = unknown>(
  endpoint: string,
  options?: RequestInit,
): Promise<TData | undefined> {
  const url = new URL(endpoint, BASE_URL)
  const res = await fetch(url, options)

  if (!res.ok) {
    const { errors } = await res.json()
    errors?.forEach((msg: string) => console.error(msg))

    return
  }

  return res.json()
}

export async function updatePharmacy(
  mode: "add" | "edit",
  payload: PharmacyInputs,
  id?: number,
): Promise<Response> {
  try {
    const session = await getSession()

    const endpoint = mode === "add" ? "/v1/pharmacies" : `/v1/pharmacies/${id}`
    const options: RequestInit = {
      method: mode === "add" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pharmacy_admin_id: session?.user.user_id,
        name: payload.name,
        address: payload.address,
        sub_district: payload.subDistrict,
        district: payload.district,
        province: Number(payload.province),
        city: Number(payload.city),
        postal_code: payload.postalCode,
        latitude: payload.latitude,
        longitude: payload.longitude,
        pharmacist_name: payload.pharmacistName,
        pharmacist_license_no: payload.pharmacistLicense,
        pharmacist_phone_no: payload.pharmacistPhone,
        operational_hours_open: Number(payload.opensAt),
        operational_hours_close: Number(payload.closesAt),
        operational_days: payload.operationalDays,
      } satisfies Partial<Omit<Pharmacy, "id">>),
    }

    const res = await fetch(BASE_URL + endpoint, options)
    if (!res.ok) await handleFailedRequest(res)

    return {
      success: true,
      message: `Pharmacy ${mode === "add" ? "added" : "updated"}`,
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    }
  }
}

export async function deletePharmacy(id?: number): Promise<Response> {
  try {
    const endpoint = `/v1/pharmacies/${id}`
    const options: RequestInit = {
      method: "DELETE",
    }

    const res = await fetch(BASE_URL + endpoint, options)
    if (!res.ok) handleFailedRequest(res)

    return {
      success: true,
      message: "Pharmacy deleted",
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    }
  }
}

export async function updateAdmin(
  mode: "add" | "edit",
  payload: UserInputs,
  id?: number,
): Promise<Response> {
  try {
    const endpoint =
      mode === "add" ? "/v1/users/admin" : `/v1/users/admin/${id}`
    const options: RequestInit = {
      method: mode === "add" ? "POST" : "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
      } satisfies Partial<UserInputs>),
    }

    const res = await fetch(BASE_URL + endpoint, options)
    if (!res.ok) await handleFailedRequest(res)

    return {
      success: true,
      message: `Admin ${mode === "add" ? "added" : "updated"}`,
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    }
  }
}

export async function deleteAdmin(id: number): Promise<Response> {
  try {
    const endpoint = `/v1/users/admin/${id}`
    const options: RequestInit = {
      method: "DELETE",
    }

    const res = await fetch(BASE_URL + endpoint, options)
    if (!res.ok) await handleFailedRequest(res)

    return {
      success: true,
      message: "Admin deleted",
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    }
  }
}

export async function addStockMutation(
  payload: StockMutationInputs & {
    pharmacy_product_id: number
  },
): Promise<Response> {
  try {
    const { stock, ...data } = payload

    const endpoint = "/v1/stock-mutations"
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        stock: Number(stock),
      } satisfies Record<keyof typeof payload, number>),
    }

    const res = await fetch(BASE_URL + endpoint, options)
    if (!res.ok) await handleFailedRequest(res)

    return {
      success: true,
      message: "Stock mutation added",
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    }
  }
}

export async function updatePharmacyProduct(
  mode: "add" | "edit",
  payload: PharmacyProductInputs & Pick<PharmacyProduct, "pharmacy_id">,
  id?: number,
): Promise<Response> {
  try {
    const { pharmacy_id, product_id, ...data } = payload

    const endpoint =
      mode === "add" ? "/v1/pharmacy-products" : `/v1/pharmacy-products/${id}`
    const options: RequestInit = {
      method: mode === "add" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(mode === "add" ? { pharmacy_id, product_id } : {}),
        ...data,
      } satisfies Partial<typeof payload>),
    }

    const res = await fetch(BASE_URL + endpoint, options)
    if (!res.ok) await handleFailedRequest(res)

    return {
      success: true,
      message: `Pharmacy product ${mode === "add" ? "added" : "updated"}`,
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    }
  }
}

interface ProductsFilter {
  drug_class?: number
  search?: string
  limit?: number
  sort?: string
  sort_by?: string
  page?: number
}

export const useProductData = (filters: ProductsFilter) => {
  const { drug_class, search, limit, sort, sort_by, page } = filters

  let url = "/v1/products?"
  if (search) url += `search=${search}&`
  if (limit) url += `limit=${limit}&`
  if (sort_by) url += `sort_by=${sort_by}&sort=${sort}&`
  if (drug_class) url += `drug_class=${drug_class}&`
  if (page) url += `page=${page}`

  const { data, isLoading, mutate, error } =
    useSWR<ResponseGetAll<IProduct[]>>(url)

  const resetFilters = () => {
    mutate()
  }

  return {
    data,
    error,
    isLoading,
    mutate,
    resetFilters,
  }
}

export async function updatePost(
  mode: "add" | "edit",
  payload: ProductInputs,
  id?: number,
): Promise<Response> {
  try {
    const formData = new FormData()
    formData.append("name", payload.name)
    formData.append("generic_name", payload.generic_name)
    formData.append("content", payload.content)
    formData.append("description", payload.description)
    formData.append("drug_form", payload.drug_form)
    formData.append("unit_in_pack", payload.unit_in_pack)
    formData.append("weight", payload.weight.toString())
    formData.append("length", payload.length.toString())
    formData.append("width", payload.width.toString())
    formData.append("height", payload.height.toString())
    formData.append("image", payload.image)
    formData.append("manufacturer_id", payload.manufacturer_id.toString())
    formData.append("selling_unit", payload.selling_unit.toString())
    formData.append(
      "drug_classification_id",
      payload.drug_classification_id.toString(),
    )
    formData.append(
      "product_category_id",
      payload.product_category_id.toString(),
    )

    const url = new URL(
      `${mode === "edit" ? `/v1/products/${id}` : "/v1/products"}`,
      process.env.NEXT_PUBLIC_DB_URL,
    )

    const options: RequestInit = {
      method: mode === "add" ? "POST" : "PUT",
      headers: {
        accept: "application/json",
      },
      body: formData,
    }

    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error("Failed to update a product")
    }

    if (mode === "edit") {
      mutate(url)
      const id = (await res.json()).id as string
      await fetch(`/api/revalidate/products/${id}`)
    }

    return {
      success: true,
      message: `Product ${mode === "add" ? "added" : "updated"}`,
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    }
  }
}

export async function deletePost(id: number): Promise<Response> {
  try {
    const url = new URL(`/v1/products/${id}`, process.env.NEXT_PUBLIC_DB_URL)
    const options: RequestInit = {
      method: "DELETE",
    }

    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error("Failed to delete a product")
    }

    mutate(url)

    return {
      success: true,
      message: "Products deleted",
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    }
  }
}

export async function updateProductCategory(
  mode: "add" | "edit",
  payload: ProductCategoriesInputs,
  id?: number,
): Promise<Response> {
  try {
    const { ...data } = payload

    const url = new URL(
      `${
        mode === "edit"
          ? `/v1/product-categories/${id}`
          : "/v1/product-categories"
      }`,
      process.env.NEXT_PUBLIC_DB_URL,
    )
    const options: RequestInit = {
      method: mode === "add" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    }

    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error("Failed to update a product category")
    }

    if (mode === "edit") {
      mutate(url)
    }

    return {
      success: true,
      message: `Product category ${mode === "add" ? "added" : "updated"}`,
    }
  } catch (err) {
    return {
      success: false,
      message:
        err instanceof Error
          ? err.message
          : "Something went wrong please try again",
    }
  }
}

export async function deleteProductCategory(id: number): Promise<Response> {
  try {
    const url = new URL(
      `/v1/product-categories/${id}`,
      process.env.NEXT_PUBLIC_DB_URL,
    )
    const options: RequestInit = {
      method: "DELETE",
    }

    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error("Failed to delete a product category")
    }

    return {
      success: true,
      message: "Product category deleted",
    }
  } catch (err) {
    return {
      success: false,
      message:
        err instanceof Error
          ? err.message
          : "Something went wrong please try again",
    }
  }
}

export async function getDrugClassificationName(
  drug_classification_id: number,
) {
  const response = await fetch(
    `https://byebyesick-staging.irfancen.com/v1/drug-classifications/no-params`,
  )
  const data: ResponseGetAll<IDrugClassification[]> = await response.json()
  let classificationName = "Unknown"

  data.data.items.forEach((item: IDrugClassification) => {
    if (item.id === drug_classification_id) {
      classificationName = item.name
    }
  })

  return classificationName
}

export async function getProductCategoryName(product_category_id: number) {
  const response = await fetch(
    `https://byebyesick-staging.irfancen.com/v1/product-categories/no-params`,
  )
  const data: ResponseGetAll<IProductCategory[]> = await response.json()
  let productCategoryName = "Unknown"

  data.data.items.forEach((item: IProductCategory) => {
    if (item.id === product_category_id) {
      productCategoryName = item.name
    }
  })

  return productCategoryName
}

export async function getManufacturerName(manufacturer_id: number) {
  const response = await fetch(
    `https://byebyesick-staging.irfancen.com/v1/manufacturers/no-params`,
  )
  const data: ResponseGetAll<IManufacturer[]> = await response.json()
  let manufacturersName = "Unknown"

  data.data.items.forEach((item: IManufacturer) => {
    if (item.id === manufacturer_id) {
      manufacturersName = item.name
    }
  })

  return manufacturersName
}

export async function addToCart(payload: CartInputs): Promise<Response> {
  try {
    const { ...data } = payload
    const url = new URL("/v1/cart-items", process.env.NEXT_PUBLIC_DB_URL)
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    }

    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error("Failed adding item to cart")
    }

    mutate(url)
    return {
      success: true,
      message: `Cart Added`,
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong please try again",
    }
  }
}

export async function deleteCart(product_ids: number[]): Promise<Response> {
  try {
    const url = new URL(
      `/v1/cart-items?product_ids=${product_ids}`,
      process.env.NEXT_PUBLIC_DB_URL,
    )

    const options: RequestInit = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }

    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error("Failed to delete a product")
    }

    mutate(url)

    return {
      success: true,
      message: "Cart deleted",
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    }
  }
}

export const useCartList = () => {
  const { data, isLoading, error, mutate } =
    useSWR<ResponseGetAll<ICart[]>>("/v1/cart-items")

  return {
    cartdata: data,
    cartisLoading: isLoading,
    carterror: error,
    cartMutate: mutate,
  }
}
