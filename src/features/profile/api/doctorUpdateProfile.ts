import type { IProfileDoctor } from "@/types/api"

export async function doctorUpdateProfile(
  body: Partial<IProfileDoctor>,
  image?: File,
  certificate?: File,
) {
  const formData = new FormData()
  formData.append("name", body.name as string)
  formData.append("starting_year", body.starting_year?.toString() as string)
  formData.append("consultation_fee", body.consultation_fee as string)
  formData.append(
    "doctor_specialization_id",
    body.doctor_specialization?.id.toString() as string,
  )
  if (image) formData.append("profile_photo", image)
  if (certificate) formData.append("certificate", certificate)

  var requestOptions: RequestInit = {
    method: "PUT",
    headers: {
      Accept: "Application/json",
    },
    body: formData,
  }
  return fetch(`${process.env.BASE_URL}/v1/profile/doctor`, requestOptions)
}
