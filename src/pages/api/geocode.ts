import type { NextApiRequest, NextApiResponse } from "next"

import type { Response } from "@/types"
import type { GMapsResponse, Location, Result } from "@/types/gmaps"

export type Geocode = {
  address: Result["formatted_address"]
  location: Location
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response<Geocode[]>>,
) {
  try {
    const address = req.query.address as string

    if (!address) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      })
    }

    const url = new URL("https://maps.googleapis.com/maps/api/geocode/json")
    url.searchParams.append("key", process.env.GOOGLE_MAPS_API_KEY as string)
    url.searchParams.append("address", address)
    url.searchParams.append("region", "id")

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch Google Maps API")
    }

    const data: GMapsResponse = await response.json()

    const formattedData = data.results.map((result) => ({
      address: result.formatted_address,
      location: result.geometry.location,
    }))

    return res.status(200).json({
      success: true,
      data: formattedData,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"

    return res.status(500).json({ success: false, message })
  }
}
