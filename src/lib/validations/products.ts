import z from "zod"

import { productCategories, productClass, productManufacturers } from "@/config"

export const productSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(100, { message: "Title must be no more than 100 characters long" })
    .refine((name) => !/[^a-zA-Z0-9 ]/.test(name), {
      message: "Name can only contain alphanumeric characters and spaces",
    }),
  generic_name: z
    .string()
    .min(2, { message: "Generic Name must be at least 2 characters long" })
    .max(100, {
      message: "Generic Name must be no more than 100 characters long",
    })
    .refine((generic_name) => !/[^a-zA-Z0-9 ]/.test(generic_name), {
      message:
        "Generic Name can only contain alphanumeric characters and spaces",
    }),
  content: z
    .string()
    .min(500, { message: "Content must be at least 500 characters long" })
    .max(5000, {
      message: "Content must be no more than 5000 characters long",
    }),
  description: z
    .string()
    .min(500, { message: "description must be at least 500 characters long" })
    .max(5000, {
      message: "description must be no more than 5000 characters long",
    }),
  drug_form: z
    .string()
    .min(2, { message: "Drug Form must be at least 2 characters long" })
    .max(100, { message: "Drug Form must be no more than 100 characters long" })
    .refine((drug_form) => !/[^a-zA-Z0-9 ]/.test(drug_form), {
      message: "Drug Form can only contain alphanumeric characters and spaces",
    }),
  unit_in_pack: z
    .string()
    .min(2, { message: "Drug Form must be at least 2 characters long" })
    .max(100, { message: "Drug Form must be no more than 100 characters long" })
    .refine((drug_form) => !/[^a-zA-Z0-9 ]/.test(drug_form), {
      message: "Drug Form can only contain alphanumeric characters and spaces",
    }),
  weight: z
    .number()
    .min(2, { message: "Weight must be at least 2" })
    .max(100, { message: "Weight must be no more than 100" }),

  length: z
    .number()
    .min(2, { message: "Length must be at least 2" })
    .max(100, { message: "Length must be no more than 100" }),

  width: z
    .number()
    .min(2, { message: "Width must be at least 2" })
    .max(100, { message: "Width must be no more than 100" }),

  height: z
    .number()
    .min(2, { message: "Height must be at least 2" })
    .max(100, { message: "Height must be no more than 100" }),

  image: z.string().url({ message: "Image is required" }),
  price: z
    .string()
    .min(2, { message: "Drug Form must be at least 2 characters long" })
    .max(100, { message: "Drug Form must be no more than 100 characters long" })
    .refine((drug_form) => !/[^a-zA-Z0-9 ]/.test(drug_form), {
      message: "Drug Form can only contain alphanumeric characters and spaces",
    }),
  selling_unit: z
    .string()
    .min(2, { message: "Seling Unit must be at least 2 characters long" })
    .max(100, {
      message: "Seling Unit must be no more than 100 characters long",
    })
    .refine((drug_form) => !/[^a-zA-Z0-9 ]/.test(drug_form), {
      message: "Seling Unit can only contain alphabetic characters and spaces",
    }),
  manufacturer_id: z
    .enum(productManufacturers)
    .default(productManufacturers[0]),
  drug_classification_id: z.enum(productClass).default(productClass[0]),
  product_category_id: z.enum(productCategories).default(productCategories[0]),
})

// MANUFACTURERS, DRUG CLASS, PRODUCT CATE SHOULD BE FROM BACKEND
// manufacturer_id: z
// .number() // Use number instead of enum for manufacturer_id
// .int() // Ensure it's an integer
// .refine((manufacturer_id) => productManufacturers.includes(manufacturer_id), {
//   message: "Invalid manufacturer_id",
// }),

// drug_classification_id: z
// .number() // Use number instead of enum for drug_classification_id
// .int() // Ensure it's an integer
// .refine((drug_classification_id) => productClass.includes(drug_classification_id), {
//   message: "Invalid drug_classification_id",
// }),

// product_category_id: z
// .number() // Use number instead of enum for product_category_id
// .int() // Ensure it's an integer
// .refine((product_category_id) => productCategories.includes(product_category_id), {
//   message: "Invalid product_category_id",
// }),
