export function resetPassword(password: string, token: string | undefined) {
  var requestOptions = {
    method: "POST",
    body: JSON.stringify({
      password: password,
    }),
  }
  return fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/v1/auth/reset-password?token=${token}`,
    requestOptions,
  )
}
