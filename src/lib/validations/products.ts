import z from "zod"

export const productSchema = z.object({
  title: z
    .string()
    .min(2, { message: "Title must be at least 2 characters long" })
    .max(100, { message: "Title must be no more than 100 characters long" })
    .refine((title) => !/[^a-zA-Z0-9 ]/.test(title), {
      message: "Title can only contain alphanumeric characters and spaces",
    }),
  content: z
    .string()
    .min(500, { message: "Content must be at least 500 characters long" })
    .max(5000, {
      message: "Content must be no more than 5000 characters long",
    }),
  isPremium: z.boolean(),
  image: z.string().url({ message: "Image is required" }),
})
