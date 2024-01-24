import { getSession } from "next-auth/react"
import useSWR, { mutate } from "swr"

import type {
  CartInputs,
  CheckoutInput,
  ManufacturersInput,
  PharmacyInputs,
  PharmacyProductInputs,
  ProductCategoriesInputs,
  ProductInputs,
  Response,
  StockMutationInputs,
  StockMutationRequestInputs,
  TransactionInput,
  UserInputs,
} from "@/types"
import type {
  AddressIForm,
  AddressResponse,
  doctorI,
  ICart,
  IDrugClassification,
  IManufacturer,
  IncomingRequest,
  IProductCategory,
  ITransaction,
  Pharmacy,
  PharmacyProduct,
  Prescription,
  PrescriptionProduct,
  ResponseGetAll,
  SickLeaveForm,
} from "@/types/api"
import { handleFailedRequest } from "@/lib/utils"

export const BASE_URL = process.env.NEXT_PUBLIC_DB_URL as string

/**
 * Generic fetcher for `swr`
 */
export async function fetcher<TData = unknown>(
  endpoint: string,
  options?: RequestInit,
): Promise<TData | undefined> {
  const url = BASE_URL + endpoint
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
        "Content-Type": "multipart/form-data",
      },
      body: JSON.stringify({
        pharmacy_admin_id: session?.user.user_id,
        name: payload.name,
        address: payload.address,
        sub_district: payload.subDistrict,
        district: payload.district,
        province_id: Number(payload.provinceId),
        city_id: Number(payload.cityId),
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
    if (!res.ok) await handleFailedRequest(res)

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

export async function requestStockMutation(
  payload: StockMutationRequestInputs & {
    pharmacy_product_dest_id: number
  },
): Promise<Response> {
  try {
    const { stock, ...data } = payload

    const endpoint = "/v1/stock-mutations/requests"
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
      message: "Stock mutation request is sent",
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    }
  }
}

export async function updateStockMutationRequestStatus(
  payload: Pick<IncomingRequest, "product_stock_mutation_request_status_id">,
  id: number,
): Promise<Response> {
  try {
    const endpoint = `/v1/stock-mutations/requests/${id}`
    const options: RequestInit = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }

    const res = await fetch(BASE_URL + endpoint, options)
    if (!res.ok) await handleFailedRequest(res)

    return {
      success: true,
      message: "Stock mutation request is updated",
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

export async function updateCertificate(
  mode: "add" | "edit",
  payload: Pick<
    SickLeaveForm,
    "session_id" | "starting_date" | "ending_date" | "description"
  >,
  id?: number,
): Promise<Response> {
  try {
    const { session_id, ...data } = payload

    const endpoint =
      mode === "add" ? "/v1/sick-leave-forms" : `/v1/sick-leave-forms/${id}`
    const options: RequestInit = {
      method: mode === "add" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(mode === "add" ? { session_id } : {}),
        ...data,
      } satisfies Partial<typeof payload>),
    }

    const res = await fetch(BASE_URL + endpoint, options)
    if (!res.ok) await handleFailedRequest(res)

    return {
      success: true,
      message: "Sick leave certificate is updated",
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    }
  }
}

export async function updatePrescription(
  mode: "add" | "edit",
  payload: Pick<Prescription, "session_id" | "symptoms" | "diagnosis"> & {
    prescription_products: Pick<PrescriptionProduct, "product_id" | "note">[]
  },
  id?: number,
): Promise<Response> {
  try {
    const { session_id, ...data } = payload

    const endpoint =
      mode === "add" ? "/v1/prescriptions" : `/v1/prescriptions/${id}`
    const options: RequestInit = {
      method: mode === "add" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...(mode === "add" ? { session_id } : {}),
        ...data,
      } satisfies Partial<typeof payload>),
    }

    const res = await fetch(BASE_URL + endpoint, options)
    if (!res.ok) await handleFailedRequest(res)

    return {
      success: true,
      message: "Prescription is updated",
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    }
  }
}

export async function endChatRoom(id: number): Promise<Response> {
  try {
    const endpoint = `/v1/chats/${id}`
    const options: RequestInit = {
      method: "PUT",
    }

    const res = await fetch(BASE_URL + endpoint, options)
    if (!res.ok) await handleFailedRequest(res)

    return {
      success: true,
      message: "Chat room is ended",
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    }
  }
}

interface ProductsFilter {
  drug_class?: number | string
  search?: string
  limit?: number
  sort?: string
  sort_by?: string
  page?: number
}

export const useProductData = <T>(
  filters: ProductsFilter,
  baseUrl: string | null,
) => {
  const { drug_class, search, limit, sort, sort_by, page } = filters

  let url = `${baseUrl}`
  if (search) url += `&search=${search}&`
  if (limit) url += `limit=${limit}&`
  if (sort_by) url += `sort_by=${sort_by}&sort=${sort}&`
  if (drug_class) url += `drug_class=${drug_class}&`
  if (page) url += `&page=${page}`

  const { data, isLoading, mutate, error } = useSWR<ResponseGetAll<T>>(url)

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

export async function updateProducts(
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

    if (payload.image instanceof Blob || payload.image instanceof File) {
      formData.append("image", payload.image, "image.png")
    }

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

    const url =
      BASE_URL + `${mode === "edit" ? `/v1/products/${id}` : "/v1/products"}`

    const options: RequestInit = {
      method: mode === "add" ? "POST" : "PUT",
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
      body: formData,
    }

    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error("Failed to update a product")
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

export async function deleteProducts(id: number): Promise<Response> {
  try {
    const url = BASE_URL + `/v1/products/${id}`
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

    const url =
      BASE_URL +
      `${
        mode === "edit"
          ? `/v1/product-categories/${id}`
          : "/v1/product-categories"
      }`
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
      const errorResponse = await res.json()
      throw new Error(
        errorResponse
          ? "Sorry, this category name is already taken"
          : "Something went wrong please try again",
      )
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
    const url = BASE_URL + `/v1/product-categories/${id}`
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
  const response = await fetch(`${BASE_URL}/v1/drug-classifications/no-params`)
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
  const response = await fetch(`${BASE_URL}/v1/product-categories/no-params`)
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
  const response = await fetch(`${BASE_URL}/v1/manufacturers/no-params`)
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
    const url = BASE_URL + "/v1/cart-items"
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
      const errorResponse = await res.json()
      throw new Error(
        errorResponse
          ? "Sorry, the product is out of stock"
          : "Something went wrong please try again",
      )
    }

    mutate(url)
    return {
      success: true,
      message: `Product added to cart`,
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
    const url = BASE_URL + `/v1/cart-items?product_ids=${product_ids}`

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

    return {
      success: true,
      message: "Product deleted from cart",
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

export const useAdressList = () => {
  const { data, isLoading, error, mutate } = useSWR<
    ResponseGetAll<AddressIForm[]>
  >("/v1/profile/addresses")

  return {
    addressList: data,
    addressIsLoading: isLoading,
    addressError: error,
    addressMutate: mutate,
  }
}

export const useAddressMain = () => {
  const { data, isLoading, error, mutate } = useSWR<
    AddressResponse<AddressIForm>
  >(`/v1/profile/addresses/main`)

  return {
    addressData: data,
    addressIsLoading: isLoading,
    addressError: error,
    addressMutate: mutate,
  }
}

export async function updateManufacturers(
  mode: "add" | "edit",
  payload: ManufacturersInput,
  id?: number,
): Promise<Response> {
  try {
    const formData = new FormData()
    formData.append("name", payload.name)

    if (payload.image instanceof Blob || payload.image instanceof File) {
      formData.append("image", payload.image, "image.png")
    }

    const url = new URL(
      `${mode === "edit" ? `/v1/manufacturers/${id}` : "/v1/manufacturers"}`,
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
      throw new Error("Failed to update a manufacturer")
    }

    if (mode === "edit") {
      mutate(url)
    }

    return {
      success: true,
      message: `Manufacturers ${mode === "add" ? "added" : "updated"}`,
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

export async function deleteManufacturers(id: number): Promise<Response> {
  try {
    const url = new URL(
      `/v1/manufacturers/${id}`,
      process.env.NEXT_PUBLIC_DB_URL,
    )
    const options: RequestInit = {
      method: "DELETE",
    }

    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error("Failed to delete a manufacturer")
    }

    return {
      success: true,
      message: "Manufacturers deleted",
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

export const useDoctorList = (search?: string) => {
  let url = "/v1/users/doctor"
  if (search) url += `?search=${search}`
  const { data, isLoading, error, mutate } =
    useSWR<ResponseGetAll<doctorI[]>>(url)
  return {
    doctorList: data,
    doctorIsLoading: isLoading,
    doctorError: error,
    doctorMutate: mutate,
  }
}

export async function getShippingMethods(
  payload: CheckoutInput,
): Promise<Response> {
  try {
    const endpoint = `/v1/shipping-methods`
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
      }),
    }

    const res = await fetch(BASE_URL + endpoint, options)
    if (!res.ok) await handleFailedRequest(res)
    return res.json()
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    }
  }
}

export async function createTransactions(
  payload: TransactionInput,
): Promise<Response<{ data: ITransaction }>> {
  try {
    const endpoint = "/v1/transactions"
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
      }),
    }
    const res = await fetch(BASE_URL + endpoint, options)
    if (!res.ok) await handleFailedRequest(res)
    return {
      success: true,
      message: `Transaction created`,
      data: await res.json(),
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Something went wrong",
    }
  }
}

export async function updatePayment(
  id: number,
  mode: "reject" | "accept" | "cancel",
): Promise<Response> {
  try {
    const url = new URL(
      `/v1/transactions/${id}/${mode}`,
      process.env.NEXT_PUBLIC_DB_URL,
    )
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }

    const res = await fetch(url, options)
    if (!res.ok) {
      const errorResponse = await res.json()
      throw new Error(errorResponse.errors || "An error occurred")
    }

    return {
      success: true,
      message: `Payment ${mode === "accept" ? "accepted" : "rejected"}`,
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

export async function updatePharmacyAdminOrder(
  id: number,
  mode: "reject" | "accept" | "cancel" | "ship",
): Promise<Response> {
  try {
    const url = new URL(
      `/v1/orders/${id}/${mode}`,
      process.env.NEXT_PUBLIC_DB_URL,
    )
    const options: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }

    const res = await fetch(url, options)
    if (!res.ok) {
      const errorResponse = await res.json()
      throw new Error(errorResponse.errors || "An error occurred")
    }

    return {
      success: true,
      message: `Orders ${mode === "accept" ? "accepted" : "rejected"}`,
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

export async function updateDoctorSpecs(
  mode: "add" | "edit",
  payload: ManufacturersInput,
  id?: number,
): Promise<Response> {
  try {
    const formData = new FormData()
    formData.append("name", payload.name)

    if (payload.image instanceof Blob || payload.image instanceof File) {
      formData.append("image", payload.image, "image.png")
    }

    const url = new URL(
      `${mode === "edit" ? `/v1/doctor-specs/${id}` : "/v1/doctor-specs"}`,
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
      throw new Error("Failed to update a doctor specs")
    }

    if (mode === "edit") {
      mutate(url)
    }

    return {
      success: true,
      message: `Doctor Specialization ${mode === "add" ? "added" : "updated"}`,
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

export async function deleteDoctorSpecs(id: number): Promise<Response> {
  try {
    const url = new URL(
      `/v1/doctor-specs/${id}`,
      process.env.NEXT_PUBLIC_DB_URL,
    )
    const options: RequestInit = {
      method: "DELETE",
    }

    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error("Failed to delete a Doctor Specialization")
    }

    return {
      success: true,
      message: "Doctor Specialization deleted",
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
