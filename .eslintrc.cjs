/** @type {import("eslint").Linter.Config} */
const config = {
  extends: [
    "eslint:recommended",
    "next/core-web-vitals",
    "plugin:tailwindcss/recommended",
    "prettier",
  ],
  rules: {
    "prefer-const": "error",
    "no-unused-vars": "off",
    "no-undef": "off",
    "tailwindcss/classnames-order": "off",
  },
  settings: {
    tailwindcss: {
      callees: ["cn"],
    },
  },
}

module.exports = config
