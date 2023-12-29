import type { ProductInputs, Response } from "@/types"
import type { Products } from "@/types/api"

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

export async function updatePost(
  mode: "add" | "edit",
  payload: ProductInputs,
  id?: number,
): Promise<Response> {
  try {
    const { image, ...data } = payload
    // const convertedImage = await convertToCloudinaryURL(image)

    // if (!convertedImage) {
    //   throw new Error("Failed to upload the image. Try again later")
    // }

    const url = new URL(
      `/products/${mode === "edit" ? id : ""}`,
      process.env.NEXT_PUBLIC_DB_URL,
    )
    const options: RequestInit = {
      method: mode === "add" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        // image: convertedImage,
        // slug: mode === "add" ? slugify(data.title) : undefined,
      } satisfies Partial<Omit<Products, "id">>),
    }

    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error("Failed to update a post")
    }

    // Revalidate path if edited
    if (mode === "edit") {
      const slug = (await res.json()).slug as string

      await fetch(`/api/revalidate?slug=${slug}`)
    }

    return {
      success: true,
      message: `Product ${mode === "add" ? "added" : "updated"}`,
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    }
  }
}

export async function deletePost(id: number): Promise<Response> {
  try {
    const url = new URL(`/products/${id}`, process.env.NEXT_PUBLIC_DB_URL)
    const options: RequestInit = {
      method: "DELETE",
    }

    const res = await fetch(url, options)

    if (!res.ok) {
      throw new Error("Failed to delete a post")
    }

    return {
      success: true,
      message: "Products deleted",
    }
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : "Something went wrong",
    }
  }
}
