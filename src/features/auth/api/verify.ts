import type { VerifyFormSchemaType } from "@/lib/validations/auth"

export function verify(
  body: VerifyFormSchemaType & { email: string },
  token: string | string[] | undefined,
) {
  const formData = new FormData()
  formData.append("name", body.name)
  formData.append("email", body.email)
  formData.append("password", body.password)
  formData.append("user_role_id", body.role)
  formData.append("certificate", body.image)

  var requestOptions = {
    method: "POST",
    body: formData,
  }
  return fetch(
    `${process.env.BASE_URL}/v1/auth/register?token=${token}`,
    requestOptions,
  )
}
