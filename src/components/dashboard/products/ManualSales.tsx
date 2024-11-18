'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface Order {
  id: string
  creationDate: string
  deliveryDate: string | null
  idUser: string
  total: number
  status: string
  idBusiness: string
  products: Record<string, number>
}

interface User {
  id: string
  fullname: string
  username: string
  mail: string
}

type SortField = 'creationDate' | 'total' | 'status'
type SortOrder = 'asc' | 'desc'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export default function ManualSales() {
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<Record<string, User>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortField, setSortField] = useState<SortField>('creationDate')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  // useEffect(() => {
  //   if (storedBusinessId) {
  //     setBusinessId(storedBusinessId)
  //     setNewProduct((prev) => ({
  //       ...prev,
  //       idBusiness: storedBusinessId
  //     }))
  //   } else {
  //     setError('No se encontró el ID del negocio')
  //   }
  // }, [])

  useEffect(() => {
    const fetchOrders = async () => {
      const storedBusinessId = sessionStorage.getItem('currentBusinessId')
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `${API_URL}/orders-service/api/v1/orders/${storedBusinessId}/business`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch orders')
        }
        const data = await response.json()
        setOrders(data)
        fetchUsers(data)
      } catch (err) {
        setError('Error al cargar las órdenes')
        toast({
          title: 'Error',
          description: 'No se pudieron cargar las órdenes',
          variant: 'destructive'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const fetchUsers = async (orders: Order[]) => {
    const userIds = Array.from(new Set(orders.map((order) => order.idUser)))
    const userPromises = userIds.map((id) =>
      fetch(`${API_URL}/users-service/api/v1/users/${id}`).then((res) =>
        res.json()
      )
    )
    const usersData = await Promise.all(userPromises)
    const usersMap = usersData.reduce(
      (acc, user) => {
        acc[user.id_user] = user
        return acc
      },
      {} as Record<string, User>
    )
    setUsers(usersMap)
  }

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const sortedOrders = [...orders].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1
    if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const handleDeliverOrder = (orderId: string) => {
    setSelectedOrderId(orderId)
    setIsConfirmModalOpen(true)
  }

  const confirmDelivery = async () => {
    if (!selectedOrderId) return

    try {
      const response = await fetch(
        `${API_URL}/orders-service/api/v1/orders/${selectedOrderId}/delivered`,
        {
          method: 'PUT'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      setOrders(
        orders.map((order) =>
          order.id === selectedOrderId
            ? { ...order, status: 'delivered' }
            : order
        )
      )

      toast({
        title: 'Éxito',
        description: 'Orden marcada como entregada correctamente'
      })
    } catch (error) {
      console.error('Error updating order status:', error)
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado de la orden',
        variant: 'destructive'
      })
    } finally {
      setIsConfirmModalOpen(false)
      setSelectedOrderId(null)
    }
  }

  const handleBackToBusinesses = () => {
    // Implementación de la función para volver a la página de negocios
  }

  if (isLoading) return <div>Cargando órdenes...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Órdenes del Negocio</h1>

      <Button onClick={handleBackToBusinesses} variant="outline" className="mb-4">
        Volver a Emprendimientos
      </Button>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Productos</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort('creationDate')}
              >
                Fecha de Creación
                {sortField === 'creationDate' &&
                  (sortOrder === 'asc' ? (
                    <ChevronUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-2 h-4 w-4" />
                  ))}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('total')}>
                Total
                {sortField === 'total' &&
                  (sortOrder === 'asc' ? (
                    <ChevronUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-2 h-4 w-4" />
                  ))}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('status')}>
                Estado
                {sortField === 'status' &&
                  (sortOrder === 'asc' ? (
                    <ChevronUp className="ml-2 h-4 w-4" />
                  ) : (
                    <ChevronDown className="ml-2 h-4 w-4" />
                  ))}
              </Button>
            </TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                {users[order.idUser]?.fullname || 'Usuario desconocido'}
              </TableCell>
              <TableCell>
                {Object.entries(order.products).map(([product, quantity]) => (
                  <div key={product}>
                    {product}: {quantity}
                  </div>
                ))}
              </TableCell>
              <TableCell>
                {new Date(order.creationDate).toLocaleDateString()}
              </TableCell>
              <TableCell>${order.total.toFixed(2)}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${
                    order.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'in_progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {order.status === 'in_progress'
                    ? 'En progreso'
                    : order.status === 'confirmed'
                      ? 'Confirmado'
                      : 'Entregado'}
                </span>
              </TableCell>
              <TableCell>
                {order.status === 'confirmed' && (
                  <Button
                    size="sm"
                    onClick={() => handleDeliverOrder(order.id)}
                  >
                    Marcar como entregado
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Entrega</DialogTitle>
          </DialogHeader>
          <p>¿Está seguro que desea marcar esta orden como entregada?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={confirmDelivery}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}