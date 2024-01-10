import z from "zod"

export const userProfileFormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is requred",
  }),
  date: z.string().min(1, { message: "Date is Required" }),
})

export type UserProfileFormSchemaType = z.infer<typeof userProfileFormSchema>
