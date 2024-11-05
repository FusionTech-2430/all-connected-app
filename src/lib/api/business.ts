'use server'

import { CreateBusinessData, Business } from "@/types/business";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/businesses-service/api/v1`;

async function fetcher<T>(url: string, options: RequestInit): Promise<T> {
  const fullUrl = API_URL + url;
  try {
    const response = await fetch(fullUrl, options);
    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Failed to fetch ${fullUrl}:`, response.status, errorData);
      throw new Error(errorData.message || 'Unexpected server error');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch ${fullUrl}: ${error.message}`);
    } else {
      throw new Error(`Failed to fetch ${fullUrl}: Unknown error`);
    }
  }
}

export const getBusinesses = () => {
  return fetcher<Business[]>('/businesses', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    cache: 'no-store'
  });
}

export const getBusiness = (businessId: string) => {
  
  return fetcher<Business>(`/businesses/${businessId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });
}

export async function createBusiness(data: CreateBusinessData): Promise<Business> {
  const formData = new FormData();
  
  // Append only string values
  formData.append('name', data.name);
  formData.append('owner_id', data.owner_id);
  formData.append('organization', data.organization);
  
  if (data.logo_url) {
    formData.append('logo_url', data.logo_url);
  }

  return fetcher<Business>('/businesses', {
    method: 'POST',
    body: formData,
  });
}

export async function deleteBusiness(businessId: string) {
  return fetcher<void>(`/businesses/${businessId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json'
    }
  });
}

// Update business
export async function updateBusiness(businessId: string, data: FormData): Promise<Business> {
  return fetcher<Business>(`/businesses/${businessId}`, {
    method: 'PUT',
    body: data,
  });
}