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

const MAX_FILE_SIZE = 500000
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
]

export const verifyFormSchema = z
  .object({
    role: z.string({ invalid_type_error: "Please select your role" }).min(1, {
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
    image: z
      .instanceof(File)
      .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 500KB`) // this should be greater than or equals (>=) not less that or equals (<=)
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        ".jpg, .jpeg, .png and .pdf files are accepted.",
      ),
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
      message: "Certificate is required",
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
