import { JwtPayload } from 'jwt-decode'

export interface JwtClaims extends JwtPayload {
    roles: string[]
    user_id: string
    email: string
    email_verified: boolean
}
