// users.ts
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
  try {
    const response = await fetch(`/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // If the response is 204 No Content, return null or an empty object
    return response.status === 204 ? null : await response.json();
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error; // Re-throw the error so it can be handled by the component
  }
}

export async function updateUser(userId: string, active: boolean): Promise<User> {
  const requestBody = JSON.stringify({ active });
  console.log('Request Body:', requestBody);

  return fetcher<User>(`/users/${userId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json'
    },
    body: requestBody,
    cache: 'no-store'
  });
}


// The deactivate the user
export async function deactivateUser(userId: string, deleteReason: string): Promise<User> {
  return fetcher<User>(`/users/${userId}/deactivate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ delete_reason: deleteReason }),
    cache: 'no-store'
  });
}

// // Activate the user
// export async function activateUser(userId: string): Promise<User> {
//   return fetcher<User>(`/users/${userId}/activate`, {
//     method: 'POST',
//     headers: {
//       Accept: 'application/json'
//     },
//     cache: 'no-store'
//   });
// }