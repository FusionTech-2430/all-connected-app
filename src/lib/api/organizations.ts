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
    const response = await fetch(`/organizations`, {
      method: 'POST',
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to create organization: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating organization:', error);
    throw new Error('Failed to create organization. Please try again later.');
  }
}

export async function updateOrganization(organizationId: string, data: FormData): Promise<Organizations> {
  try {
    return await fetcher<Organizations>(`/organizations/${organizationId}`, {
      method: 'PUT',
      body: data,
    });
  } catch (error) {
    console.error(`Error updating organization with id ${organizationId}:`, error);
    throw new Error('Failed to update organization. Please try again later.');
  }
}

export async function deleteOrganization(organizationId: string): Promise<void> {
  try {
    const response = await fetch(`/organizations/${organizationId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to delete organization: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`);
    }
  } catch (error) {
    console.error(`Error deleting organization with id ${organizationId}:`, error);
    throw new Error('Failed to delete organization. Please try again later.');
  }
}