/** @type {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} */
const importConfig = {
  importOrder: [
    "",
    "^(react/(.*)$)|^(react$)",
    "^(next/(.*)$)|^(next$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "^@/types(.*)$",
    "^@/config(.*)$",
    "^@/assets/(.*)$",
    "^@/lib/(.*)$",
    "^@/hooks/(.*)$",
    "^@/components/ui/(.*)$",
    "^@/components/(.*)$",
    "^@/pages/(.*)$",
    "",
    "^[.]",
  ],
}

/** @type {import("prettier-plugin-tailwindcss").PluginOptions} */
const tailwindConfig = {
  tailwindFunctions: ["cn"],
  tailwindAttributes: ["className", "class"],
}

/** @type {import("prettier").Options} */
const config = {
  semi: false,

  ...importConfig,
  ...tailwindConfig,

  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
}

export default config
