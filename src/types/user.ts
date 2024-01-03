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
