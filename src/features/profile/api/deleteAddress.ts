export async function deleteAddress(id: string) {
  var requestOptions: RequestInit = {
    method: "DELETE",
    headers: {
      Accept: "Application/json",
    },
  }
  return fetch(
    `${process.env.BASE_URL}/v1/profile/addresses/${id}`,
    requestOptions,
  )
}
