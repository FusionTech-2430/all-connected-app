// users.ts
'use server'

import { User } from "@/types/users/user";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users-service/api/v1`;

async function fetcher<T>(url: string, options: RequestInit): Promise<T> {
  try {
    const response = await fetch(API_URL + url, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Unexpected server error');
    }
    if (response.status === 204) {
      // Return an empty object as T
      return {} as T;
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch ${API_URL + url}: ${error.message}`);
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
  try {
    const response = await fetch(API_URL + `/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.status === 204 ? null : await response.json();
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

export async function updateUser(userId: string, active: boolean): Promise<User> {
  const requestBody = JSON.stringify({ active });
  console.log('Request Body:', requestBody);

  return fetcher<User>(`/users/${userId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: requestBody,
    cache: 'no-store'
  });
}

export async function deactivateUser(userId: string, deleteReason: string): Promise<void> {
  const response = await fetch(API_URL + `/users/${userId}/deactivate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ delete_reason: deleteReason }),
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
}

export async function activateUser(userId: string): Promise<void> {
  const response = await fetch(API_URL + `/users/${userId}/activate`, {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
}