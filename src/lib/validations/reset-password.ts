import z from "zod"

export const resetPasswordEmailScheme = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export const newPasswordScheme = z
  .object({
    password: z.string().min(8, {
      message: "Password must be at least 8 characters",
    }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .transform((e) => (e === "" ? undefined : e)),
  })
  .required()
  .refine((data) => data.confirmPassword === data.password, {
    message: "Password don't match",
    path: ["confirmPassword"],
  })
