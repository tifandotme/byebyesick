import z from "zod"

export const doctorProfileFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is requred",
  }),
  starting_year: z.number().min(1800, { message: "Minimum year is 1800" }),
  doctor_specialization_id: z.string().min(1, { message: "required" }),
  consultation_fee: z.string().min(1, { message: "required" }),
  profile_photo: z.any().refine((image) => image.length > 0, {
    message: "Image is required",
  }),
  certificate: z.any().refine((image) => image.length > 0, {
    message: "Certificate is required",
  }),
})

export type DoctorProfileFormSchemaType = z.infer<
  typeof doctorProfileFormSchema
>
