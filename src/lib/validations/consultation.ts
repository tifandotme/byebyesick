import { z } from "zod"

export const chatRoomSchema = z
  .object({
    message: z.string().trim(),
    image: z.string(),
    pdf: z.string(),
  })
  .refine(
    (data) => {
      return data.message.length || data.image.length || data.pdf.length
    },
    {
      message: "Message or attachment is required",
      path: ["message"],
    },
  )

export const certificateSchema = z.object({
  description: z.string().trim().min(1, "Required"),
  starting_date: z.string().min(1, "Required"),
  ending_date: z.string().min(1, "Required"),
})

export const prescriptionSchema = z.object({
  symptoms: z.string().trim().min(1, "Required"),
  diagnosis: z.string().trim().min(1, "Required"),
  prescription_products: z.array(
    z.object({
      product_id: z.number(),
      product_name: z.string().trim().min(1, "Required"),
      note: z.string().trim().min(1, "Required"),
    }),
  ),
})
