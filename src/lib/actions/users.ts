'use server'

import { User } from '@/types'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users-service/api/v1`

async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(API_URL + url, options)
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error inesperado en el servidor')
    }
    return await response.json()
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export async function createUser(formData: FormData): Promise<User> {
  return fetcher<User>('/users', {
    method: 'POST',
    body: formData
  })
}

export async function deleteUser(userId: string) {
  try {
    const response = await fetch(`/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error inesperado en el servidor')
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }

  cookies().delete('access-token')
  cookies().delete('refresh-token')

  redirect('/')
}

export async function getUser(userId: string): Promise<User> {
  return fetcher<User>(`/users/${userId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })
}
