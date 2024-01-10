import { z } from "zod"

const cartSchema = z.object({
  product_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
})

export default cartSchema
