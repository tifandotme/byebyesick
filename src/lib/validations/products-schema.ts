import z from "zod"

export const productSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(100, { message: "Title must be no more than 100 characters long" })
    .refine((name) => !/[^a-zA-Z0-9 ]/.test(name), {
      message: "Name can only contain alphanumeric characters and spaces",
    }),
  generic_name: z
    .string()
    .min(2, { message: "Generic Name must be at least 2 characters long" })
    .max(100, {
      message: "Generic Name must be no more than 100 characters long",
    })
    .refine((generic_name) => !/[^a-zA-Z0-9 ]/.test(generic_name), {
      message:
        "Generic Name can only contain alphanumeric characters and spaces",
    }),
  content: z
    .string()
    .min(5, { message: "Content must be at least 5 characters long" })
    .max(500, {
      message: "Content must be no more than 500 characters long",
    }),
  description: z
    .string()
    .min(15, { message: "description must be at least 15 characters long" })
    .max(5000, {
      message: "description must be no more than 5000 characters long",
    }),
  drug_form: z
    .string()
    .min(2, { message: "Drug Form must be at least 2 characters long" })
    .max(100, { message: "Drug Form must be no more than 100 characters long" })
    .refine((drug_form) => !/[^a-zA-Z0-9 ]/.test(drug_form), {
      message: "Drug Form can only contain alphanumeric characters and spaces",
    }),
  unit_in_pack: z
    .string()
    .min(2, { message: "Drug Form must be at least 2 characters long" })
    .max(100, { message: "Drug Form must be no more than 100 characters long" })
    .refine((drug_form) => !/[^a-zA-Z0-9 ]/.test(drug_form), {
      message: "Drug Form can only contain alphanumeric characters and spaces",
    }),
  weight: z.number().min(2, { message: "Weight must be at least 2" }),

  length: z.number().min(2, { message: "Length must be at least 2" }),

  width: z.number().min(2, { message: "Width must be at least 2" }),

  height: z.number().min(2, { message: "Height must be at least 2" }),

  image: z.any().refine((image) => image.length > 0, {
    message: "Image is required",
  }),

  selling_unit: z
    .string()
    .min(2, { message: "Seling Unit must be at least 2 characters long" })
    .max(100, {
      message: "Seling Unit must be no more than 100 characters long",
    })
    .refine((selling_unit) => !/[^a-zA-Z0-9 ]/.test(selling_unit), {
      message: "Seling Unit can only contain alphabetic characters and spaces",
    }),
  manufacturer_id: z
    .number()
    .int()
    .refine((val) => val > 0, {
      message: "Manufacturer ID must be a positive integer",
    }),

  drug_classification_id: z
    .number()
    .int()
    .refine((val) => val > 0, {
      message: "Drug Classification ID must be a positive integer",
    }),

  product_category_id: z
    .number()
    .int()
    .refine((val) => val > 0, {
      message: "Product Category ID must be a positive integer",
    }),
})
