'use server'

import { User } from '@/types'

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
