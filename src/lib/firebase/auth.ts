// Create utility functions for Firebase Authentication
import { auth } from '@/lib/firebase/config'
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth'

export const signIn = async (email: string, password: string) => {
  const auth = getAuth()
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    return userCredential
  } catch (error) {
    throw error
  }
}

export const logOut = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.log('Error signing out: ', error)
    throw error
  }
}

export const getCurrentUser = (): User | null => {
  return auth.currentUser
}

// Add more Auth utility functions as needed
