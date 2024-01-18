import { z } from "zod"

// TODO convert to camelCase?
export const stockMutationSchema = z.object({
  product_stock_mutation_type_id: z.number(),
  stock: z.coerce
    .number()
    .min(1, "Required")
    .pipe(z.string({ coerce: true })),
})

export const stockMutationRequestSchema = z.object({
  pharmacy_product_origin_id: z.number().min(1, "Required"),
  stock: stockMutationSchema.shape.stock,
})
