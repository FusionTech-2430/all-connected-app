// Create utility functions for Firebase Authentication
import { auth } from '@/lib/firebase/config'
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  User
} from 'firebase/auth'

export const signIn = async (email: string, password: string) => {
  const auth = getAuth()
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  return userCredential
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

export const signUp = async (email: string, password: string) => {
  const auth = getAuth()
  try {
    return await createUserWithEmailAndPassword(auth, email, password)
  } catch (error) {
    throw error
  }
}

// Add more Auth utility functions as needed
