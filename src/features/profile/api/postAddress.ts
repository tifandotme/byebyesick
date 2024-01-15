import type { AddressIForm } from "@/types/api"

export async function postAddress(body: Partial<AddressIForm>) {
  var requestOptions: RequestInit = {
    method: "POST",
    headers: {
      Accept: "Application/json",
    },
    body: JSON.stringify(body),
  }
  return fetch(`${process.env.BASE_URL}/v1/profile/addresses`, requestOptions)
}
