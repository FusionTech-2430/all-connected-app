'use server'

import { FA, FQ } from "@/types/faq";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/communication-service/api/v1`;

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

export const getFQs = () => {
  return fetcher<FQ[]>('/communication', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    cache: 'no-store'
  });
}

export const getFQById = (FQId: string) => {
  return fetcher<FQ>(`/example/${FQId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });
}


// Create a new FAQ with a json object
export async function createFQ(): Promise<FQ> {
    return fetcher<FQ>('/example', {
        method: 'POST',
        headers: {
        Accept: 'application/json'
        }
    });
}

export async function deleteFQ(businessId: string) {
  return fetcher<void>(`/example/${businessId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json'
    }
  });
}

// Update a FAQ with a json object
export async function updateFQ(businessId: string): Promise<FQ> {
    return fetcher<FQ>(`/example/${businessId}`, {
        method: 'PUT',
        headers: {
        Accept: 'application/json'
        }
    });
}