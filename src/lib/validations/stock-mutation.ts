import { z } from "zod"

export const stockMutationSchema = z.object({
  product_stock_mutation_type_id: z.number(),
  stock: z.coerce
    .number()
    .min(1, "Required")
    .pipe(z.string({ coerce: true })),
})
