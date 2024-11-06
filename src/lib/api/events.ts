'use server'

export interface event {
  id : number
  nombre : string
  aforo : number
  fecha : Date
}

const API_URL = 'https://mockserverevents-production.up.railway.app/api/v1';


async function fetcher<T>(url: string, options: RequestInit): Promise<T> {
  try {
    const response = await fetch(API_URL + url, options);

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unexpected server error');
      } else {
        throw new Error(`Unexpected response format. Expected JSON but received ${contentType}.`);
      }
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


// Get all events
export const getEvents = () => {
  return fetcher<event[]>('/eventos', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  });
};
