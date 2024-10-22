'use server'

import {
  signIn as firebaseSignIn,
  logOut,
  signUp as firebaseSignUp
} from '@/lib/firebase/auth'
import { createUser } from '@/lib/actions/users'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signIn(formData: FormData) {
  const email = formData.get('email')
  const password = formData.get('password')

  const userCredential = await firebaseSignIn(
    email as string,
    password as string
  )

  cookies().set('access-token', await userCredential.user.getIdToken())

  cookies().set('refresh-token', userCredential.user.refreshToken, {
    httpOnly: true
  })

  redirect('/home')
}

export async function signUp(formData: FormData) {
  const mail = formData.get('mail')
  const password = formData.get('password')
  formData.append('roles', 'customer')

  console.log(formData)

  // Create a new user in Firebase Authentication and in the Users Service
  const userCredential = await firebaseSignUp(
    mail as string,
    password as string
  )

  cookies().set('access-token', await userCredential.user.getIdToken())
  cookies().set('refresh-token', userCredential.user.refreshToken, {
    httpOnly: true
  })

  // TODO: In backend, the service is creating the user into firebase also
  // so the duplicate email error is thrown
  // const user = await createUser(formData)

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
