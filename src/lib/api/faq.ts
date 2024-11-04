'use server'

import { FAQ } from "@/types/faq";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/qa-service/api/v1`;

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

export const getFaqs = async (): Promise<FAQ[]> => {
  const faqs = await fetcher<FAQ[]>('/questions', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    cache: 'no-store'
  });
  return faqs;
}

export const getFaqById = (FaqId: number): Promise<FAQ> => {
  return fetcher<FAQ>(`/questions/${FaqId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });
}

// Create a new FAQ with a json object
export async function createFaq(faqData: { pregunta: string, respuesta: string }): Promise<FAQ> {
    return fetcher<FAQ>('/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(faqData)
    });
}

export async function deleteFaq(FaqId: number): Promise<void> {
  return fetcher<void>(`/questions/${FaqId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json'
    }
  });
}

// Update a FAQ with a json object
export async function updateFaq(FaqId: number, faqData: { pregunta: string, respuesta: string }): Promise<FAQ> {
    return fetcher<FAQ>(`/questions/${FaqId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(faqData)
    });
}