import * as z from "zod"

export const loginFormSchema = z
  .object({
    email: z
      .string()
      .min(1, {
        message: "Email is requred",
      })
      .email({
        message: "Please input valid email",
      }),
    password: z.string().min(1, {
      message: "Password is required",
    }),
  })
  .required()

export type LoginFormSchemaType = z.infer<typeof loginFormSchema>
