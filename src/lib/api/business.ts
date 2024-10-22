'use server'

import { Business, CreateBusiness } from "@/types/business"

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/businesses-service/api/v1`

async function fetcher<T>(url:string, options:RequestInit):Promise<T> {
  try {
    const response = await fetch(API_URL + url, options)
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error inesperado en el servidor')
    }
    return await response.json()
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

export const getBusinesses = () => {
  return fetcher<Business[]>('/businesses', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    },
    cache: 'no-store'
  })
}

export const getBusiness = (businessId: string) => {
  return fetcher<Business>(`/business/${businessId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })
}

export const createBusiness = async (business: CreateBusiness) => {

    console.log(business)

    return fetcher('/business', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(business)
    })
}