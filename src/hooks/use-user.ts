'use client'

import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@/lib/firebase/config'
import { useState, useEffect } from 'react'
import { type User } from '@/types/users/user'
import { getUser } from '@/services/userService'

export const useUser = () => {
  const [firebaseUser] = useAuthState(auth)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!firebaseUser) {
      setUser(null)
      setLoading(false)
      return
    }

    // Función asíncrona para traer el usuario desde el backend
    const fetchUser = async () => {
      setLoading(true)
      try {
        const backUser = await getUser(firebaseUser.uid)
        setUser(backUser)
      } catch (err) {
        setError(err as Error)
        console.error('Error fetching user from backend:', err)
      } finally {
        console.log('User fetched:', user)
        setLoading(false)
      }
    }

    fetchUser()
  }, [firebaseUser, user])

  return { firebaseUser, user, loading, error, setUser }
}
