import z from "zod"

export const doctorProfileFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is requred",
  }),
  starting_year: z.coerce
    .number()
    .min(1800, { message: "Minimum year is 1800" }),
  doctor_specialization_id: z.string().min(1, { message: "required" }),
  consultation_fee: z.coerce
    .number()
    .min(1, "Required")
    .pipe(z.string({ coerce: true })),
})

export type DoctorProfileFormSchemaType = z.infer<
  typeof doctorProfileFormSchema
>
