export async function setOnlineStatus(status: boolean) {
  var requestOptions: RequestInit = {
    method: "POST",
    body: JSON.stringify({
      is_online: status,
    }),
    headers: {
      Accept: "Application/json",
    },
  }
  return fetch(
    `${process.env.BASE_URL}/v1/profile/doctor/set-online`,
    requestOptions,
  )
}
