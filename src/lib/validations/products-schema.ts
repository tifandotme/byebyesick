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
    .min(1, { message: "Drug Form must be at least 1" })
    .max(100, { message: "Drug Form must be no more than 100 characters long" })
    .refine((drug_form) => !/[^a-zA-Z0-9 ]/.test(drug_form), {
      message: "Drug Form can only contain alphanumeric characters and spaces",
    }),
  weight: z.number().min(0.01, { message: "Weight must be greater than 0" }),
  length: z.number().min(0.01, { message: "Length must be greater than 0" }),
  width: z.number().min(0.01, { message: "Width must be greater than 0" }),
  height: z.number().min(0.01, { message: "Height must be greater than 0" }),

  image: z.string().or(
    z.any().refine(
      (file) => {
        if (!(file instanceof File)) {
          return false
        }

        if (file.size > 500 * 1024) {
          return false
        }

        const allowedExtensions = ["png", "jpg", "jpeg"]
        const fileExtension = file.name.split(".").pop()?.toLowerCase()

        if (fileExtension) {
          if (!allowedExtensions.includes(fileExtension)) {
            return false
          }
        } else {
          return false
        }

        if (!allowedExtensions.includes(fileExtension)) {
          return false
        }

        return true
      },
      {
        message:
          "Image must be a valid image file (png, jpg, jpeg) and cannot exceed 500 KB",
      },
    ),
  ),
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
