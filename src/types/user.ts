export interface UserI {
  email: string
  name: string
  password: string
  user_role_id: number
  image: string
  id: number
}

export interface RegisterToken {
  data: string
}

export interface userJWT {
  user_id: number
  email: string
  user_role_id: number
  image: string
  iss: string
  exp: number
  iat: number
}
