const config = {
  "*.{js,jsx,ts,tsx,json,css}": ["prettier --write"],
  "*.{ts,tsx}": ["eslint --fix --max-warnings 0"],
}

export default config
