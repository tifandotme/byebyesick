export async function setMainAddress(id: string) {
  var requestOptions: RequestInit = {
    method: "POST",
    headers: {
      Accept: "Application/json",
    },
  }
  return fetch(
    `${process.env.BASE_URL}/v1/profile/addresses/${id}/main`,
    requestOptions,
  )
}
