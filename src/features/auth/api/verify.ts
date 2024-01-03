import type { UserI } from "@/types/user"

export function register(body: Partial<UserI>, token: string) {
  var requestOptions = {
    method: "POST",
    body: JSON.stringify(body),
  }
  return fetch(
    `${process.env.BASE_URL}/v1/auth/register?token=${token}`,
    requestOptions,
  )
}
