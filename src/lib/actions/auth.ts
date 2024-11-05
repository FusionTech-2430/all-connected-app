'use server'

import {
  signIn as firebaseSignIn,
  logOut,
  signUp as firebaseSignUp
} from '@/lib/firebase/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createUser } from './users'
import { FirebaseError } from 'firebase/app'

export async function signIn(prevState: unknown, formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  try {
    const userCredential = await firebaseSignIn(
      email as string,
      password as string
    )

    cookies().set('access-token', await userCredential.user.getIdToken())

    cookies().set('refresh-token', userCredential.user.refreshToken, {
      httpOnly: true
    })
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/user-not-found':
          return { error: 'Usuario no encontrado' }
        case 'auth/wrong-password':
          return { error: 'Contraseña incorrecta' }
        case 'auth/invalid-email':
          return { error: 'Correo electrónico inválido' }
        case 'auth/invalid-credential':
          return { error: 'Credenciales inválidas' }
        default:
          return { error: 'Ocurrió un error desconocido' }
      }
    } else {
      return { error: 'Ocurrió un error inesperado' }
    }
  }

  // redirect('/home')
}

export async function signUp(formData: FormData) {
  const mail = formData.get('mail')
  const password = formData.get('password')
  formData.append('roles', 'customer')

  // Create a new user in Firebase Authentication and in the Users Service
  const userCredential = await firebaseSignUp(
    mail as string,
    password as string
  )

  cookies().set('access-token', await userCredential.user.getIdToken())
  cookies().set('refresh-token', userCredential.user.refreshToken, {
    httpOnly: true
  })

  formData.append('id_user', userCredential.user.uid)

  await createUser(formData)

  // const [userCredential, user] = await Promise.all([
  // ])

  redirect('/sign-up/OnBoarding')
}

export async function signOut() {
  await logOut()
  cookies().delete('access-token')
  cookies().delete('refresh-token')

  redirect('/')
}
