import z from "zod"

export const pharmacySchema = z
  .object({
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
    city: z.number().min(1, "Required"),
    province: z.number().min(1, "Required"),
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
    opensAt: z.string(),
    closesAt: z.string(),
    operationalDays: z.array(z.string()).min(1, "Required"),
    pharmacistName: z.string().min(1, "Required"),
    pharmacistLicense: z.string().min(1, "Required"),
    pharmacistPhone: z.string().min(1, "Required"),
  })
  .refine((data) => Number(data.opensAt) < Number(data.closesAt), {
    message: "Closing hour must come after opening hour",
    path: ["closesAt"],
  })

export const pharmacyProductSchema = z.object({
  product_id: z.number().min(1, "Required"),
  is_active: z.boolean(),
  price: z.coerce
    .number()
    .min(1, "Required")
    .pipe(z.string({ coerce: true })),
})
