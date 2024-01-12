export function register(email: string) {
  var requestOptions = {
    method: "POST",
    body: JSON.stringify({
      email: email,
    }),
  }
  return fetch(
    `${process.env.NEXT_PUBLIC_DB_URL}/v1/auth/register-token`,
    requestOptions,
  )
}
