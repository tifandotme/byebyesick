import useSWR, { mutate } from "swr"

import type { ProductCategoriesInputs, ProductInputs, Response } from "@/types"
import type { ApiResponse, IProduct } from "@/types/api"

/**
 * Generic fetcher for `swr`
 */
export async function fetcher<TData>(
  endpoint: string,
  options?: RequestInit,
): Promise<TData> {
  const url = new URL(endpoint, process.env.NEXT_PUBLIC_DB_URL)
  const res = await fetch(url, options)

  if (!res.ok) {
    throw new Error("Failed to fetch at " + endpoint)
  }

  return res.json()
}

export async function updatePharmacy(
  mode: "add" | "edit",
  payload: PharmacyInputs,
  id?: number,
): Promise<Response> {
  try {
    const url = new URL(
      `/v1/pharmacies/${mode === "edit" ? id : ""}`,
      process.env.NEXT_PUBLIC_DB_URL,
    )
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
        latitude: String(payload.latitude),
        longitude: String(payload.longitude),
        pharmacist_name: payload.pharmacistName,
        pharmacist_license_no: payload.pharmacistLicense,
        pharmacist_phone_no: payload.pharmacistPhone,
        operational_hours_open: Number(payload.opensAt),
        operational_hours_close: Number(payload.closesAt),
        operational_days: payload.operationalDays,
      } satisfies Partial<Omit<Pharmacy, "id">>),
    }

    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error("Failed to update pharmacy")
    }

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

export async function updateAdmin(
  mode: "add" | "edit",
  payload: UserInputs,
  id?: number,
): Promise<Response> {
  try {
    const url = new URL(
      `/v1/users/admin/${mode === "edit" ? id : ""}`,
      process.env.NEXT_PUBLIC_DB_URL,
    )
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

    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error("Failed to update admin")
    }

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
    const url = new URL(`/v1/users/admin/${id}`, process.env.NEXT_PUBLIC_DB_URL)
    const options: RequestInit = {
      method: "DELETE",
    }

    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error("Failed to delete a admin")
    }

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

interface ProductsFilter {
  drug_class?: number
  search?: string
  limit?: number
  sort?: "name" | "date"
  sort_by?: "asc" | "desc"
  page?: number
}

export const useProductData = (filters: ProductsFilter) => {
  const { drug_class, search, limit, sort, sort_by, page } = filters

  let url = "/v1/products?"
  if (search) url += `search=${search}&`
  if (limit) url += `limit=${limit}&`
  if (sort) url += `sort=${sort}&`
  if (sort_by) url += `sort_by=${sort_by}&`
  if (drug_class) url += `drug_class=${drug_class}&`
  if (page) url += `page=${page}`

  const { data, isLoading, mutate, error } =
    useSWR<ApiResponse<IProduct[]>>(url)

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
    // const { ...data } = payload

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

    // Revalidate path if edited
    // if (mode === "edit") {
    //   const slug = (await res.json()).slug as string

    //   await fetch(`/api/revalidate?slug=${slug}`)
    // }

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
        // slug: mode === "add" ? slugify(data.name) : undefined,
      }),
    }

    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error("Failed to update a product category")
    }

    // Revalidate path if edited
    // if (mode === "edit") {
    //   const slug = (await res.json()).slug as string
    //   await fetch(`/api/revalidate?slug=${slug}`)
    // }

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
