'use server'

import { User } from "@/types/users/user";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users-service/api/v1`;

async function fetcher<T>(url: string, options: RequestInit): Promise<T> {
  try {
    const response = await fetch(API_URL + url, options);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Unexpected server error');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch ${url}: ${error.message}`);
    } else {
      throw new Error(`Failed to fetch ${url}: Unknown error`);
    }
  }
}

export const getUsers = () => {
  return fetcher<User[]>('/users', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    cache: 'no-store'
  });
}

export const getUser = (userId: string) => {
  return fetcher<User>(`/users/${userId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });
}

export async function deleteUser(userId: string) {
  return fetcher<void>(`/users/${userId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json'
    }
  });
}

// Update user
export async function updateUser(userId: string, data: FormData): Promise<User> {
  return fetcher<User>(`/users/${userId}`, {
    method: 'PUT',
    body: data,
  });
}