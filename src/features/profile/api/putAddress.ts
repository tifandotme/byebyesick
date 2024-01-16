import type { AddressIForm } from "@/types/api"

export async function putAddress(body: Partial<AddressIForm>, id: string) {
  var requestOptions: RequestInit = {
    method: "PUT",
    headers: {
      Accept: "Application/json",
    },
    body: JSON.stringify(body),
  }
  return fetch(
    `${process.env.BASE_URL}/v1/profile/addresses/${id}`,
    requestOptions,
  )
}
