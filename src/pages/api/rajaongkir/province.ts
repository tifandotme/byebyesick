import type { NextApiRequest, NextApiResponse } from "next"

import type {
  Province,
  Response as RajaOngkirResponse,
} from "@/types/rajaongkir"

export type Response<TData = unknown> = {
  success: boolean
  message?: string
  data?: TData
}

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  try {
    const url = new URL("https://api.rajaongkir.com/starter/province")
    const options: ResponseInit = {
      headers: {
        key: process.env.RAJAONGKIR_API_KEY as string,
      },
    }

    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error("Failed to fetch RajaOngkir API")
    }

    const data: RajaOngkirResponse<Province[]> = await response.json()

    return res.status(200).json({
      success: true,
      data: data.rajaongkir.results,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"

    return res.status(500).json({ success: false, message })
  }
}

// const data: RajaOngkirResponse = {
//   rajaongkir: {
//     results: [
//       {
//         province_id: "1",
//         province: "Balii",
//       },
//       {
//         province_id: "2",
//         province: "Bangka Belitung",
//       },
//       {
//         province_id: "3",
//         province: "Banten",
//       },
//       {
//         province_id: "4",
//         province: "Bengkulu",
//       },
//       {
//         province_id: "5",
//         province: "DI Yogyakarta",
//       },
//       {
//         province_id: "6",
//         province: "DKI Jakarta",
//       },
//       {
//         province_id: "7",
//         province: "Gorontalo",
//       },
//       {
//         province_id: "8",
//         province: "Jambi",
//       },
//       {
//         province_id: "9",
//         province: "Jawa Barat",
//       },
//       {
//         province_id: "10",
//         province: "Jawa Tengah",
//       },
//       {
//         province_id: "11",
//         province: "Jawa Timur",
//       },
//       {
//         province_id: "12",
//         province: "Kalimantan Barat",
//       },
//       {
//         province_id: "13",
//         province: "Kalimantan Selatan",
//       },
//       {
//         province_id: "14",
//         province: "Kalimantan Tengah",
//       },
//       {
//         province_id: "15",
//         province: "Kalimantan Timur",
//       },
//       {
//         province_id: "16",
//         province: "Kalimantan Utara",
//       },
//       {
//         province_id: "17",
//         province: "Kepulauan Riau",
//       },
//       {
//         province_id: "18",
//         province: "Lampung",
//       },
//       {
//         province_id: "19",
//         province: "Maluku",
//       },
//       {
//         province_id: "20",
//         province: "Maluku Utara",
//       },
//       {
//         province_id: "21",
//         province: "Nanggroe Aceh Darussalam (NAD)",
//       },
//       {
//         province_id: "22",
//         province: "Nusa Tenggara Barat (NTB)",
//       },
//       {
//         province_id: "23",
//         province: "Nusa Tenggara Timur (NTT)",
//       },
//       {
//         province_id: "24",
//         province: "Papua",
//       },
//       {
//         province_id: "25",
//         province: "Papua Barat",
//       },
//       {
//         province_id: "26",
//         province: "Riau",
//       },
//       {
//         province_id: "27",
//         province: "Sulawesi Barat",
//       },
//       {
//         province_id: "28",
//         province: "Sulawesi Selatan",
//       },
//       {
//         province_id: "29",
//         province: "Sulawesi Tengah",
//       },
//       {
//         province_id: "30",
//         province: "Sulawesi Tenggara",
//       },
//       {
//         province_id: "31",
//         province: "Sulawesi Utara",
//       },
//       {
//         province_id: "32",
//         province: "Sumatera Barat",
//       },
//       {
//         province_id: "33",
//         province: "Sumatera Selatan",
//       },
//       {
//         province_id: "34",
//         province: "Sumatera Utara",
//       },
//     ],
//   },
// }
