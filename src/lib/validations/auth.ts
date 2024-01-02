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

export const verifyFormSchema = z
  .object({
    role: z.string().min(1, {
      message: "Role is required",
    }),
    password: z.string().min(1, {
      message: "Password is required",
    }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .transform((e) => (e === "" ? undefined : e)),
  })
  .required()
  .refine((data) => data.confirmPassword === data.password, {
    message: "Password don't match",
    path: ["confirmPassword"],
  })

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
export type VerifyFormSchemaType = z.infer<typeof verifyFormSchema>
