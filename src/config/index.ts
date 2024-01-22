import type {
  FooterItem,
  MainNavItem,
  NavItemRequired,
  NavItemRequiredWithRole,
} from "@/types"

export const siteConfig = {
  name: "byebyesick",
  description: "Next-gen healthcare",
  avatarDropdownNav: [
    {
      title: "Account",
      href: "/dashboard/account",
      icon: "Avatar",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "Gear",
    },
  ] satisfies NavItemRequired[],
  mainNav: [
    {
      title: "Lobby",
      items: [
        {
          title: "Products",
          href: "/products",
          description: "All the products we have to offer.",
          items: [],
        },
        {
          title: "Enlist your pharmacy",
          href: "#",
          description: "Register your pharmacy",
          items: [],
        },
        {
          title: "Blog",
          href: "#",
          description: "Read our latest blog posts.",
          items: [],
        },
      ],
    },
    {
      title: "Consultation",
      href: "/consultation",
    },
  ] satisfies MainNavItem[],
  dashboardNav: {
    all: [
      {
        title: "Account",
        href: "/dashboard/account",
        icon: "Avatar",
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: "Gear",
      },
    ] satisfies NavItemRequired[],
    byRole: [
      {
        title: "Users",
        href: "/dashboard/users",
        icon: "Person",
        role: "superAdmin",
      },
      {
        title: "Products",
        href: "/dashboard/products",
        icon: "Product",
        role: "superAdmin",
      },
      {
        title: "Manufacturers",
        href: "/dashboard/manufacturers",
        icon: "Manufacturers",
        role: "superAdmin",
      },
      {
        title: "Categories",
        href: "/dashboard/productcategories",
        icon: "ProductCategory",
        role: "superAdmin",
      },
      {
        title: "Pharmacies",
        href: "/dashboard/pharmacies",
        icon: "Pharmacies",
        role: "pharmacyAdmin",
      },
      {
        title: "Sales Report",
        href: "/dashboard/sales-report",
        icon: "PieChart",
        role: "superAdmin",
      },
    ] satisfies NavItemRequiredWithRole[],
  },
  footerNav: [
    {
      title: "Company",
      items: [
        {
          title: "Jobs",
          href: "#",
        },
        {
          title: "Newsroom",
          href: "#",
        },
        {
          title: "Become a partner",
          href: "#",
        },
        {
          title: "byebyesick Press",
          href: "#",
        },
      ],
    },
    {
      title: "Help",
      items: [
        {
          title: "About",
          href: "#",
        },
        {
          title: "Contact",
          href: "#",
        },
        {
          title: "Terms",
          href: "#",
        },
        {
          title: "Privacy",
          href: "#",
        },
      ],
    },
    {
      title: "Social",
      items: [
        {
          title: "Twitter",
          href: "https://twitter.com",
          external: true,
        },
        {
          title: "LinkedIn",
          href: "https://linkedin.com",
          external: true,
        },
        {
          title: "Instagram",
          href: "https://instagram.com",
          external: true,
        },
        {
          title: "GitHub",
          href: "https://github.com",
          external: true,
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          title: "Contact Sales",
          href: "#",
        },
        {
          title: "Support Center",
          href: "#",
        },
        {
          title: "Support Plans",
          href: "#",
        },
        {
          title: "+62 812 3456 7890",
          href: "#",
        },
      ],
    },
  ] satisfies FooterItem[],
}

export const SortConfig = [
  { value: "date", label: "Date" },
  { value: "name", label: "Name" },
]

export const SortByConfig = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
]

export const DrugClassConfig = [
  { value: "1", label: "Obat Bebas" },
  { value: "2", label: "Obat Keras" },
  { value: "3", label: "Obat Bebas Terbatas" },
  { value: "4", label: "Non Obat" },
]

export const classif = {
  "obat-bebas": 1,
  "obat-keras": 2,
  "obat-bebas-terbatas": 3,
  "non-obat": 4,
} as const

export const categories = {
  "obat-bebas": 1,
  "obat-keras": 2,
  "obat-bebas-terbatas": 3,
  "non-obat": 4,
} as const

export const usersRoleIds = {
  1: "superAdmin",
  2: "pharmacyAdmin",
  3: "doctor",
  4: "user",
} as const

export const PAYMENT_STATUS = {
  UNPAID: 1,
  WAITING_FOR_CONFIRMATION: 2,
  PAYMENT_REJECTED: 3,
  PAID: 4,
} as const

export const SUPER_ADMIN_ROLE = 1
export const PHARMACY_ADMIN_ROLE = 2
export const DOCTOR_ROLE = 3
export const PATIENT_ROLE = 4
