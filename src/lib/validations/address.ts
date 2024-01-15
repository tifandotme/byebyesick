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
  cityId: z.number().min(1, "Required"),
  provinceId: z.number().min(1, "Required"),
  postalCode: z
    .string()
    .min(1, "Required")
    .regex(/^\d{5}$/, "Invalid postal code"),
  latitude: z.coerce
    .number()
    .gte(-90)
    .lte(90)
    .pipe(z.string({ coerce: true })),
  longitude: z.coerce
    .number()
    .gte(-180)
    .lte(180)
    .pipe(z.string({ coerce: true })),
})
