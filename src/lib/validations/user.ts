import z from "zod"

export const userSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(72)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&\-*])(?=.{8,})/,
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
    ),
})
