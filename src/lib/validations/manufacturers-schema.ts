import z from "zod"

export const manufacturersSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Category Name must be at least 2 characters long" })
    .max(100, {
      message: "Category Name must be no more than 100 characters long",
    })
    .refine((name) => !/[^a-zA-Z0-9 ]/.test(name), {
      message:
        "Category Name can only contain alphanumeric characters and spaces",
    }),
  image: z
    .string()
    .or(
      z.any().refine(
        (file) => {
          if (!(file instanceof File)) {
            return false
          }

          if (file.size > 500 * 1024) {
            return false
          }

          const allowedExtensions = ["png", "jpg", "jpeg"]
          const fileExtension = file.name.split(".").pop()?.toLowerCase()

          if (fileExtension) {
            if (!allowedExtensions.includes(fileExtension)) {
              return false
            }
          } else {
            return false
          }

          if (!allowedExtensions.includes(fileExtension)) {
            return false
          }

          return true
        },
        {
          message:
            "Image must be a valid image file (png, jpg, jpeg) and cannot exceed 500 KB",
        },
      ),
    )
    .optional(),
})
