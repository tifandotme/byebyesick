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

export function formatDateChat(date: string) {
  const messageDate = new Date(date)
  const now = new Date()

  const sameDay = now.toDateString() === messageDate.toDateString()
  if (sameDay) {
    return messageDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday = yesterday.toDateString() === messageDate.toDateString()
  if (isYesterday) {
    return "Yesterday"
  }

  const sameWeek = now.getDate() - messageDate.getDate() < 7
  if (sameWeek) {
    return messageDate.toLocaleDateString([], { weekday: "long" })
  }

  const sameYear = now.getFullYear() === messageDate.getFullYear()
  if (sameYear) {
    return messageDate.toLocaleDateString([], {
      month: "short",
      day: "2-digit",
    })
  }

  return messageDate.toLocaleDateString([], {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
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

export function blobToFile(blob: Blob, fileName: string): File {
  const file: any = blob
  file.lastModified = new Date()
  file.name = fileName

  return file as File
}

export function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result?.toString() ?? "")
    reader.onerror = (error) => reject(error)
  })
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
