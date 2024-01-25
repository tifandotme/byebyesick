export async function getUserProfile(token: string) {
  var requestOptions: RequestInit = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const url = process.env.NEXT_PUBLIC_DB_URL + "/v1/profile/user"
  return fetch(url, requestOptions)
}
