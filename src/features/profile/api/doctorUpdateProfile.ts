import type { IProfileDoctor, IProfileUser } from "@/types/api"

export async function doctorUpdateProfile(
  body: Partial<IProfileDoctor>,
  image?: File,
) {
  const formData = new FormData()
  formData.append("name", body.name as string)

  if (image) formData.append("profile_photo", image)
  var requestOptions: RequestInit = {
    method: "PUT",
    headers: {
      Accept: "Application/json",
    },
    body: formData,
  }
  return fetch(`${process.env.BASE_URL}/v1/profile/doctor`, requestOptions)
}
