import type {
  FooterItem,
  MainNavItem,
  NavItemRequired,
  NavItemRequiredWithRole,
  Option,
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
    {
      title: "Profile",
      href: "/profile",
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
        role: ["superAdmin"],
      },
      {
        title: "Products",
        href: "/dashboard/products",
        icon: "Product",
        role: ["superAdmin"],
      },
      {
        title: "Manufacturers",
        href: "/dashboard/manufacturers",
        icon: "Manufacturers",
        role: ["superAdmin"],
      },
      {
        title: "Categories",
        href: "/dashboard/productcategories",
        icon: "ProductCategory",
        role: ["superAdmin"],
      },
      {
        title: "Pharmacies",
        href: "/dashboard/pharmacies",
        icon: "Pharmacies",
        role: ["pharmacyAdmin"],
      },
      {
        title: "Sales Report",
        href: "/dashboard/sales-report",
        icon: "PieChart",
        role: ["superAdmin"],
      },
      {
        title: "Transactions",
        href: "/dashboard/transactions",
        icon: "Transactions",
        role: ["superAdmin"],
      },
      {
        title: "Orders",
        href: "/dashboard/orders",
        icon: "Transactions",
        role: "pharmacyAdmin",
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

export const consultationSessionStatusIds = {
  1: "Ongoing",
  2: "Ended",
} as const

export const alertMessages = {
  sickLeaveIssued: "Sick leave certificate has been issued",
  sickLeaveUpdated: "Sick leave certificate has been updated",
  prescriptionIssued: "Prescription has been issued",
  prescriptionUpdated: "Prescription has been updated",
  chatEnded: "Chat has been ended",
} as const

export const PAYMENT_STATUS = {
  UNPAID: 1,
  WAITING_FOR_CONFIRMATION: 2,
  PAYMENT_REJECTED: 3,
  PAID: 4,
} as const

export const PAYMENT_STATUS_OPTION: Option[] = [
  {
    value: "0",
    label: "All",
  },
  { value: "1", label: "Unpaid" },
  { value: "2", label: "Waiting for Confirmation" },
  { value: "3", label: "Payment Rejected" },
  { value: "4", label: "Paid" },
]

export const PAYMENT_STATUS_MAP = {
  UNPAID: "1",
  WAITING_FOR_CONFIRMATION: "2",
  PAYMENT_REJECTED: "3",
  PAID: "4",
}

export const SUPER_ADMIN_ROLE = 1
export const PHARMACY_ADMIN_ROLE = 2
export const DOCTOR_ROLE = 3
export const PATIENT_ROLE = 4

export const ORDER_STATUS_OPTION: Option[] = [
  {
    value: "0",
    label: "All",
  },
  { value: "1", label: "Waiting for Pharmacy" },
  { value: "2", label: "Processed" },
  { value: "3", label: "Sent" },
  { value: "4", label: "Order Confirmed" },
  {
    value: "5",
    label: "Canceled by Pharmacy",
  },
  {
    value: "6",
    label: "Canceled by User",
  },
]

export const ORDER_STATUS_MAP = {
  WAITING_FOR_PHARMACY: "1",
  PROCESSED: "2",
  SENT: "3",
  ORDER_CONFIRMED: "4",
  CANCELED_BY_PHARMACY: "5",
  CANCELED_BY_USER: "6",
}
