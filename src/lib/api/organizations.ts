'use server'

import { Organizations } from "@/types/organizations"

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/organizations-service/api/v1`

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

export const getOrganizations = async () => {
  const organizations = await fetcher<Organizations[]>('/organizations', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  return organizations;
};

export const getOrganizationById = async (id: string): Promise<Organizations> => {
    console.log(id)
    return fetcher<Organizations>(`/organizations/${id}`, {
        method: 'GET',
        headers: {
        Accept: 'application/json'
        },
        cache: 'no-store'
    })
}