import z from "zod"

export const addressSchema = z.object({
  name: z
    .string()
    .min(1, "Required")
    .max(100, "Name must be no more than 100 characters long")
    .refine(
      (title) => !/[^a-zA-Z0-9 ,]/.test(title),
      "Name can only contain alphanumeric characters, comma and spaces",
    ),
  address: z
    .string()
    .min(1, "Required")
    .max(100, "Address must be no more than 100 characters long"),
  subDistrict: z
    .string()
    .min(1, "Required")
    .max(100, "Sub-district must be no more than 100 characters long"),
  district: z
    .string()
    .min(1, "Required")
    .max(100, "District must be no more than 100 characters long"),
  city: z.string().min(1, "Required"),
  province: z.string().min(1, "Required"),
  postalCode: z.string().min(1, "Required"),
  latitude: z.number().gte(-90).lte(90),
  longitude: z.number().gte(-180).lte(180),
})
