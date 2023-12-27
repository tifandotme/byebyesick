/**
 * Generic fetcher for `swr`
 */
export async function fetcher<TData>(
  endpoint: string,
  options?: RequestInit,
): Promise<TData> {
  const url = new URL(endpoint, process.env.NEXT_PUBLIC_DB_URL)
  const res = await fetch(url, options)

  if (!res.ok) {
    throw new Error("Failed to fetch at " + endpoint)
  }

  return res.json()
}
