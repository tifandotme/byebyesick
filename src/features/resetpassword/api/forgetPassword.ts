export function forgetPassword(email: string) {
  var requestOptions = {
    method: "POST",
    body: JSON.stringify({
      email: email,
    }),
  }
  return fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/v1/auth/forgot-token`,
    requestOptions,
  )
}
