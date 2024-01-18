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
  return new Intl.DateTimeFormat("en-GB", {
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

export function removeLastSegment(url: string, nth = 1) {
  const segments = url.split("/")
  segments.splice(-nth, nth)
  return segments.join("/")
}

export function slugify(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .replace(/[^\w/-]+/g, "")
    .toLowerCase()
}

export function unslugify(str: string) {
  return str.replace(/-/g, " ")
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

export async function handleFailedRequest(res: Response) {
  const { errors } = await res.json()
  if (errors.length) console.error(errors)

  throw new Error("Operation failed. Please try again later.")
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

export const calculateYear = (year: number) => {
  const output = new Date().getFullYear() - year
  if (output > 1) return output + " years"
  else return output + " year"
}
