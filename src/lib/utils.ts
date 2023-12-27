import type { NextRouter } from "next/router"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUUID() {
  return crypto.randomUUID()
}

export function isBrowser() {
  return typeof window !== "undefined"
}

export function isMacOS() {
  return isBrowser() && window.navigator.userAgent.includes("Mac")
}

export function formatPrice(price: number | string) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(price))
}

export function formatDate(date: string | Date, showTime?: boolean) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    ...(showTime && { timeStyle: "short" }),
  }).format(new Date(date))
}

/**
 * @example toSentenceCase("helloWorld") // "Hello World"
 */
export function toSentenceCase(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
}

export function slugify(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .replace(/[^\w/-]+/g, "")
    .toLowerCase()
}

export function readingTime(text: string): number {
  const wpm = 190 // adult reading speed
  const words = text.trim().split(/\s+/).length

  return Math.ceil(words / wpm)
}

export function updateQueryParams(
  router: NextRouter,
  newQuery: Record<string, string | null>,
) {
  router.replace(
    {
      query: {
        ...router.query,
        ...newQuery,
      },
    },
    undefined,
    { shallow: true, scroll: false },
  )
}

export async function convertToCloudinaryURL(url: string) {
  try {
    // Skip if already a cloudinary url
    if (!url.startsWith("blob")) {
      return url
    }

    const data = new FormData()
    data.append("file", await fetch(url).then((res) => res.blob()))
    data.append("upload_preset", "crumpled-paper")

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/tifan/image/upload",
      {
        method: "POST",
        body: data,
      },
    )

    if (!res.ok) {
      throw new Error("failed to upload product photo")
    }

    const json = await res.json()

    // Remove version
    const secureUrl = new URL(json.secure_url as string)
    const segments = secureUrl.pathname.split("/")
    segments.splice(4, 1)
    secureUrl.pathname = segments.join("/")

    return secureUrl.toString()
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
    }

    return null
  }
}

/**
 * Get shimmer effect placeholder for `next/image`
 *
 * Alternative to `plaiceholder`, when SSR is not possible
 */
export function getBase64(w: number, h: number) {
  const svg = `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#d9d9d9" offset="20%" />
      <stop stop-color="#e6e6e6" offset="50%" />
      <stop stop-color="#d9d9d9" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#d9d9d9" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

  return isBrowser() ? Buffer.from(svg).toString("base64") : window.btoa(svg)
}
