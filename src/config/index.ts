import type { DashboardConfig, SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  name: "ByeByeSick",
  description: "Where great ideas begin.",
}

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "Products",
      href: "/dashboard/products",
      icon: "Product",
    },
    {
      title: "Products Categories",
      href: "/dashboard/productcategories",
      icon: "ProductCategory",
    },
    {
      title: "Manufacturers",
      href: "/dashboard/manufacturers",
      icon: "Gear",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "Gear",
    },
  ],
  sidebarNavAdmin: [
    {
      title: "Pharmacies",
      href: "/dashboard/pharmacies",
      icon: "Pharmacies",
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: "Person",
    },
  ],
}

export const SortConfig = [
  { value: "date", label: "Date" },
  { value: "name", label: "Name" },
]

export const SortByConfig = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
]

export const usersRoleIds = {
  1: "admin",
  2: "pharmacyAdmin",
  3: "doctor",
  4: "user",
} as const

export const productManufacturers = [
  "Soho Industri Pharmas",
  "Amarox Pharma Global",
] as const

export type ProductManufacturers = (typeof productManufacturers)[number]

export const productClass = [
  "Obat Keras",
  "Obat Terbatas",
  "Obat Bebas Terbatas",
  "Non Obat",
] as const

export type ProductClassification = (typeof productClass)[number]

export const productCategories = ["Obat", "Non Obat"] as const

export type ProductCategories = (typeof productCategories)[number]
