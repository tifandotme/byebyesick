import type { IProfileUser } from "@/types/api"

export async function updateProfile(body: Partial<IProfileUser>, image?: File) {
  const formData = new FormData()
  formData.append("name", body.name as string)
  formData.append("date_of_birth", body.date_of_birth as string)
  if (image) formData.append("profile_photo", image)
  var requestOptions: RequestInit = {
    method: "PUT",
    headers: {
      Accept: "Application/json",
    },
    body: formData,
  }
  return fetch(`${process.env.BASE_URL}/v1/profile/user`, requestOptions)
}
