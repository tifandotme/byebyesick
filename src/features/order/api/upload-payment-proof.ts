export async function uploadPaymentProof(
  payment_proof: File,
  id: string | null | undefined,
) {
  const formData = new FormData()
  formData.append("payment_proof", payment_proof)
  var requestOptions: RequestInit = {
    method: "POST",
    body: formData,
  }
  return fetch(
    `${process.env.BASE_URL}/v1/transactions/${id}/proof`,
    requestOptions,
  )
}
