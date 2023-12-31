import * as z from "zod"

export const DOCTOR_ROLE_ID = "3"

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
    name: z.string().min(1, {
      message: "Name is required",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirmation Password Required" })
      .transform((e) => (e === "" ? undefined : e)),
    image: z.any(),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Password don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.role === DOCTOR_ROLE_ID && data.image === undefined) return false
      return true
    },
    {
      message: "Certificate Required",
      path: ["image"],
    },
  )

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
