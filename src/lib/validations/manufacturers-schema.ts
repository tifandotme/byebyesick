import z from "zod"

export const manufacturersSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Category Name must be at least 2 characters long" })
    .max(100, {
      message: "Category Name must be no more than 100 characters long",
    })
    .refine((name) => !/[^a-zA-Z0-9 ]/.test(name), {
      message:
        "Category Name can only contain alphanumeric characters and spaces",
    }),
  image: z.any().refine((image) => image.length > 0, {
    message: "Image is required",
  }),
})
