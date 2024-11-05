'use server'

import { Labels, Service, ServiceReport } from '@/types/services'

const API_URL = `${process.env.NEXT_PUBLIC_API_URL_SERVICES}/api/v1`;

// src/lib/api/services.ts

async function fetcher<T>(url: string, options: RequestInit): Promise<T> {
  try {
    const response = await fetch(API_URL + url, options);

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Unexpected server error");
      } else {
        throw new Error("Unexpected response format. Expected JSON.");
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch ${url}: ${error.message}`);
    } else {
      throw new Error(`Failed to fetch ${url}: Unknown error`);
    }
  }
}


// Get all services
export const getServices = () => {
  return fetcher<Service[]>('/services', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });
}

// Get all labels
export const getLabels = () => {
  return fetcher<Labels[]>('/labels', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });
}

// Get all services reports
export const getReports = () => {
  return fetcher<ServiceReport[]>('/services/reports', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    cache: 'no-store'
  });
}

export async function createService(serviceData: { name: string, description: string, photoUrl: string, stock: number, price: number, status: string, labels: string[] }): Promise<Service> {
    return fetcher<Service>('/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(serviceData)
    });
}

export const getServiceById = async (serviceId: number) => {
  return await fetcher<Service>(`/services/${serviceId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });
}

export async function createServiceReport(serviceId: number, report: ServiceReport) {
  return fetcher<void>(`/services/${serviceId}/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(report)
  });
}

export async function deleteServiceReport(serviceId: number) {
  return fetcher<void>(`/services/${serviceId}/report`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json'
    }
  });
}

