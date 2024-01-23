import type { AddressIForm } from "@/types/api"

export async function postAddress(body: Partial<AddressIForm>) {
  var requestOptions: RequestInit = {
    method: "POST",
    headers: {
      Accept: "Application/json",
    },
    body: JSON.stringify(body),
  }
  return fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/v1/profile/addresses`,
    requestOptions,
  )
}
