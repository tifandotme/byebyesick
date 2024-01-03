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
    },
  ],
}

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
