// types/user.ts
export interface UserCreation {
  fullname: string
  username: string
  password: string
  mail: string
  photo?: File
  roles: string[]
}

export interface User {
  id_user: string
  fullname: string
  username: string
  mail: string
  photo_url: string
  roles: string[]
  organizations: string[] | null
  active: boolean
}

export interface UserUpdate {
  fullname: string
  username: string
  password: string
  mail: string
  photo?: File
}
