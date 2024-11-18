'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { Loader2, ArrowUpDown } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useUserId } from '@/hooks/use-user-id'

interface Order {
  id: string
  creationDate: string
  deliveryDate: string | null
  total: number
  status: string
  products: Record<string, number>
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export default function MyOrders() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortField, setSortField] = useState<keyof Order>('creationDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  const userId = useUserId()

  if (!userId) {
    router.push('/')
  }


  useEffect(() => {
    if (userId) {
      fetchOrders()
    }
  }, [userId])

  useEffect(() => {
    filterAndSortOrders()
  }, [orders, searchTerm, statusFilter, sortField, sortOrder])

  const fetchOrders = async () => {
    if (!userId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${API_URL}/orders-service/api/v1/orders/${userId}/user`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      const data = await response.json()
      setOrders(data)
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

  const filterAndSortOrders = () => {
    let result = [...orders]

    // Filter by search term
    if (searchTerm) {
      result = result.filter((order) =>
        Object.keys(order.products).some((productName) =>
          productName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter((order) => order.status === statusFilter)
    }

    // Sort
    result.sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    setFilteredOrders(result)
  }

  const handleSort = (field: keyof Order) => {
    setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'))
    setSortField(field)
  }

  const handleConfirmOrder = (orderId: string) => {
    setSelectedOrderId(orderId)
    setIsConfirmModalOpen(true)
  }

  const confirmOrder = async () => {
    if (!selectedOrderId) return

    try {
      const response = await fetch(
        `${API_URL}/orders-service/api/v1/orders/${selectedOrderId}/confirmed`,
        {
          method: 'PUT'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to confirm order')
      }

      // Update the order status locally
      setOrders(
        orders.map((order) =>
          order.id === selectedOrderId
            ? { ...order, status: 'confirmed' }
            : order
        )
      )

      toast({
        title: 'Éxito',
        description: 'Orden confirmada correctamente'
      })
    } catch (error) {
      console.error('Error confirming order:', error)
      toast({
        title: 'Error',
        description: 'No se pudo confirmar la orden',
        variant: 'destructive'
      })
    } finally {
      setIsConfirmModalOpen(false)
      setSelectedOrderId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-[#0c4a6e]">Mis Órdenes</h1>

      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <Input
          placeholder="Buscar por nombre de producto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="in_progress">En progreso</SelectItem>
            <SelectItem value="delivered">Entregado</SelectItem>
            <SelectItem value="confirmed">Confirmado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Productos</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort('creationDate')}
                >
                  Fecha de Creación
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Fecha de Entrega</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('total')}>
                  Total
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('status')}>
                  Estado
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {Object.entries(order.products).map(
                    ([productName, quantity]) => (
                      <div key={productName}>
                        {productName}: {quantity}
                      </div>
                    )
                  )}
                </TableCell>
                <TableCell>
                  {new Date(order.creationDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {order.deliveryDate
                    ? new Date(order.deliveryDate).toLocaleDateString()
                    : 'Pendiente'}
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
                  {order.status === 'delivered' && (
                    <Button
                      size="sm"
                      onClick={() => handleConfirmOrder(order.id)}
                    >
                      Confirmar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center mt-8 text-gray-500">
          No se encontraron órdenes que coincidan con los criterios de búsqueda.
        </div>
      )}

      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Orden</DialogTitle>
          </DialogHeader>
          <p>¿Está seguro que desea confirmar esta orden?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={confirmOrder}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
