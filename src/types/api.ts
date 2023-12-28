// GET /users/:id

export type User = {
  id: number
  role: "admin" | "user" | "pharmacy_admin" | "doctor"
  name: string
  email: string
  password: string
}

// GET ...
