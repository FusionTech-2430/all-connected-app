'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getOrdersByUser } from '@/lib/api/orders'
import { OrderDTO } from '@/types/orders/orders'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, ChevronRight, Package } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useUserId } from '@/hooks/use-user-id'

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<OrderDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const userId = useUserId()

  useEffect(() => {
    async function fetchOrders() {
      try {
        if (!userId) {
          throw new Error('User ID not found')
        }
        let fetchedOrders = await getOrdersByUser(userId)
        // filter order, remove orders with status 'active'
        fetchedOrders = fetchedOrders.filter(order => order.status !== 'in_progress')
        setOrders(fetchedOrders)
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError('No se pudieron cargar los pedidos. Por favor, intenta de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [userId])

  const handleViewOrder = (orderId: string) => {
    router.push(`/orders/${orderId}`)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Cargando tus pedidos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Oops, algo salió mal</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Intentar de nuevo</Button>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No tienes pedidos aún</h2>
        <p className="text-muted-foreground mb-4">¡Empieza a comprar para ver tus pedidos aquí!</p>
        <Button onClick={() => router.push('/consumer')}>Ir a la tienda</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Mis Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número de Pedido</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{format(new Date(order.creationDate), 'PPP', { locale: es })}</TableCell>
                  <TableCell>${order.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${order.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        order.status === 'delivered' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {order.status === 'confirmed' ? 'Confirmado' :
                       order.status === 'delivered' ? 'Entregado' : 'Pendiente'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewOrder(order.id)}>
                      Ver detalles
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}