import { mutate } from "swr"

import type {
  PharmacyInputs,
  PharmacyProductInputs,
  ProductCategoriesInputs,
  ProductInputs,
  Response,
  UserInputs,
} from "@/types"
import type { Pharmacy, PharmacyProduct } from "@/types/api"
import { handleFailedRequest } from "@/lib/utils"

const BASE_URL = process.env.NEXT_PUBLIC_DB_URL as string

/**
 * Fetcher function for SWR
 */
export async function fetcher<TData = unknown>(
  endpoint: string,
  options?: RequestInit,
): Promise<TData> {
  const url = new URL(endpoint, BASE_URL)
  const res = await fetch(url, options)

  return res.json()
}

export async function updatePharmacy(
  mode: "add" | "edit",
  payload: PharmacyInputs,
  id?: number,
): Promise<Response> {
  try {
    const endpoint = mode === "add" ? "/v1/pharmacies" : `/v1/pharmacies/${id}`
    const options: RequestInit = {
      method: mode === "add" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pharmacy_admin_id: 1,
        name: payload.name,
        address: payload.address,
        sub_district: payload.subDistrict,
        district: payload.district,
        province: payload.province,
        city: payload.city,
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
    if (!res.ok) handleFailedRequest(res)

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
    if (!res.ok) handleFailedRequest(res)

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
    if (!res.ok) handleFailedRequest(res)

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

export async function updatePost(
  mode: "add" | "edit",
  payload: ProductInputs,
  id?: number,
): Promise<Response> {
  try {
    const { ...data } = payload

    const url = new URL(
      `${mode === "edit" ? `/v1/products/${id}` : "/v1/products"}`,
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
      throw new Error("Failed to update a product")
    }

    if (mode === "edit") {
      mutate(url)
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
