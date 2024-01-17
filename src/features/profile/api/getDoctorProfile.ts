export async function getDoctorProfile(token: string) {
  var requestOptions: RequestInit = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return fetch(`${process.env.BASE_URL}/v1/profile/doctor`, requestOptions)
}
