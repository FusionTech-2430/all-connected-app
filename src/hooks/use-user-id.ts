'use client'

import { JwtClaims } from '@/types/auth/jwt-claims'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

export function useUserId() {
  // Decode JWT from the cookie
  const token = Cookies.get('access-token')

  if (!token) {
    return null
  }

  const decodedToken = jwtDecode<JwtClaims>(token)

  return decodedToken.user_id
}
