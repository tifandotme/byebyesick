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

export const usersRoleIds = {
  1: "superAdmin",
  2: "pharmacyAdmin",
  3: "doctor",
  4: "user",
} as const
