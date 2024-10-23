'use server'

import { Organizations } from "@/types/organizations";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/organizations-service/api/v1`;

async function fetcher<T>(url: string, options: RequestInit): Promise<T> {
  try {
    const response = await fetch(API_URL + url, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

export const getOrganizations = async () => {
  try {
    return await fetcher<Organizations[]>('/organizations', {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      },
      cache: 'no-store'
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    throw new Error('Failed to fetch organizations. Please try again later.');
  }
}

export const getOrganizationById = async (organizationId: string) => {
  try {
    return await fetcher<Organizations>(`/organizations/${organizationId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });
  } catch (error) {
    console.error(`Error fetching organization with id ${organizationId}:`, error);
    throw new Error('Failed to fetch organization. Please try again later.');
  }
}
export async function createOrganization(data: FormData): Promise<Organizations> {
  try {
    const url = `${API_URL}/organizations`;
    console.log(`Fetching URL: ${url}`);

    // Convert FormData entries to an array before iterating
    const entries = Array.from(data.entries());
    entries.forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });

    const response = await fetch(url, {
      method: 'POST',
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`);
    }

    const createdOrganization = await response.json();
    
    // Print the fetched data
    console.log('Fetched data:', createdOrganization);

    // Ensure the photo_url is correctly set from the response
    if (createdOrganization.photoUrl) {
      createdOrganization.photo_url = createdOrganization.photoUrl;
    }

    return createdOrganization;
  } catch (error) {
    console.error('Error creating organization:', error);
    throw error;
  }
}

export async function updateOrganization(organizationId: string, data: FormData): Promise<Organizations> {
  return fetcher<Organizations>(`/organizations/${organizationId}`, {
    method: 'PUT',
    body: data,
  });
}

export async function deleteOrganization(organizationId: string): Promise<void> {
   return fetcher<void>(`/organizations/${organizationId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json'
    }
  });
}