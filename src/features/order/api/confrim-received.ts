export async function confirmReceived(id: number | string | null | undefined) {
  var requestOptions: RequestInit = {
    method: "POST",
  }
  return fetch(
    `${process.env.BASE_URL}/v1/orders/${id}/receive`,
    requestOptions,
  )
}
