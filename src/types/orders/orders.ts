export interface OrderDTO {
    id: string; // UUID de la orden
    creationDate: string; // Fecha y hora de creación
    deliveryDate: string; // Fecha y hora de entrega
    idUser: string; // ID del usuario
    idBusiness: string; // UUID del negocio
    total: number; // Total de la orden
    status: string; // Estado de la orden
    products: Record<string, number>; // Productos y cantidades
  }
  