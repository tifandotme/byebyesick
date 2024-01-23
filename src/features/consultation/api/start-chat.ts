export async function startChat(
  doctor_id: string | number,
  user_id: number | undefined,
) {
  var requestOptions: RequestInit = {
    method: "POST",
    body: JSON.stringify({
      doctor_id: doctor_id,
      user_id: user_id,
    }),
    headers: {
      Accept: "Application/json",
    },
  }
  return fetch(`${process.env.NEXT_PUBLIC_DB_URL}/v1/chats`, requestOptions)
}
