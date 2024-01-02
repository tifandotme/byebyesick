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

export const registerFormSchema = z
  .object({
    email: z
      .string()
      .min(1, {
        message: "Email is requred",
      })
      .email({
        message: "Please input valid email",
      }),
  })
  .required()

export type LoginFormSchemaType = z.infer<typeof loginFormSchema>
export type RegisterFormSchemaType = z.infer<typeof registerFormSchema>
