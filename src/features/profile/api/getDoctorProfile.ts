import { BASE_URL } from "@/pages"

export async function getDoctorProfile(token: string) {
  var requestOptions: RequestInit = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const url = BASE_URL + "/v1/profile/doctor"
  return fetch(url, requestOptions)
}
