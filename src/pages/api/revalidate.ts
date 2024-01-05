import type { NextApiRequest, NextApiResponse } from "next"

type QueryParams = {
  slug?: string
}

export type Response = {
  succses: boolean
  message: string
}

/**
 * Revalidate a page, used when a post is edited (because post pages are statically generated)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  const { slug } = req.query as QueryParams

  if (!slug) {
    return res.status(400).json({ succses: false, message: "Bad Request" })
  }

  try {
    await res.revalidate(`/${slug}`)

    return res.status(200).json({ succses: true, message: "Revalidated" })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"

    return res.status(500).json({ succses: false, message })
  }
}
