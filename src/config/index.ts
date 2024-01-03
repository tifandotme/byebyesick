import type { DashboardConfig, SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  name: "ByeByeSick",
  description: "Where great ideas begin.",
}

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "Account",
      href: "/dashboard/account",
      icon: "Avatar",
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: "CreditCard",
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
