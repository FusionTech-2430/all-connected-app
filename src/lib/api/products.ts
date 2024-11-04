'use server'

import { Products, ProductsReport} from "@/types/products";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/products-service/api/v1`;

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

// Get all products reports
export const getReports = () => {
  return fetcher<ProductsReport[]>('/products/reports', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    cache: 'no-store'
  });
}

// Get all products
export const getProducts = () => {
  return fetcher<Products[]>('/products', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });
}

// Get a product report by id
export const getReportById = (productId: number) => {
  return fetcher<ProductsReport>(`/products/${productId}/report`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });
}

// Get a product by id
export const getProductById = async (productId: number) => {
  const response = await fetcher<Products>(`/products/${productId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });
  return response;
}

export async function createProductReport(productId: number, report: ProductsReport) {
  return fetcher<void>(`/products/${productId}/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(report)
  });
}

export async function updateProductReport(productId: number, report: ProductsReport) {
  return fetcher<void>(`/products/${productId}/report`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(report)
  });
}

export async function deleteProductReport(productId: number) {
  return fetcher<void>(`/products/${productId}/report`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json'
    }
  });
}

// Delete a product by id
export async function deleteProduct(productId: number) {
  return fetcher<void>(`/products/${productId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json'
    }
  });
}