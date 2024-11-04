'use server'

import { OrderDTO } from "@/types/orders/orders";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/orders-service/api/v1`;

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

// Crear una nueva orden
export const createOrder = (orderData: { idUser: string; idBusiness: string }) => {
  return fetcher<OrderDTO>('/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(orderData),
  });
};

// Obtener todas las órdenes
export const getOrders = () => {
  return fetcher('/orders', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });
};

// Obtener una orden por ID
export const getOrderById = (orderId: string) => {
  return fetcher<OrderDTO>(`/orders/${orderId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });
};

// Eliminar una orden por ID
export const deleteOrder = (orderId: string) => {
  return fetcher(`/orders/${orderId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
  });
};

// Obtener órdenes por negocio
export const getOrdersByBusiness = (businessId: string) => {
  return fetcher(`/orders/business/${businessId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });
};

// Obtener órdenes por usuario
export const getOrdersByUser = (userId: string) => {
  return fetcher(`/orders/user/${userId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });
};

// Confirmar una orden
export const confirmOrder = (orderId: string) => {
  return fetcher(`/orders/${orderId}/confirmed`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
    },
  });
};

// Marcar una orden como entregada
export const deliverOrder = (orderId: string) => {
  return fetcher(`/orders/${orderId}/delivered`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
    },
  });
};

// Agregar un producto a una orden
export const addProductToOrder = (orderId: string, productId: number, quantity: number) => {
    const formData = new FormData();
    formData.append('quantity', quantity.toString());
  
    return fetcher(`/orders/${orderId}/products/${productId}`, {
      method: 'POST',
      body: formData,
    });
  };

// Eliminar un producto de una orden
export const removeProductFromOrder = (orderId: string, productId: number) => {
  return fetcher(`/orders/${orderId}/products/${productId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
  });
};
