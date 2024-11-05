'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getOrderById } from '@/lib/api/orders'
import { getProductById } from '@/lib/api/products'
import { OrderDTO } from '@/types/orders/orders'
import { Products } from '@/types/products'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, ArrowLeft, Package } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Image from 'next/image'

interface OrderProduct extends Products {
  quantity: number
}

interface EnrichedOrder extends Omit<OrderDTO, 'products'> {
  products: OrderProduct[]
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<EnrichedOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function fetchOrder() {
      try {
        const orderData = await getOrderById(params.id)
        
        // Fetch all products details
        const enrichedProducts = await Promise.all(
          Object.entries(orderData.products).map(async ([productId, quantity]) => {
            const product = await getProductById(Number(productId))
            return {
              ...product,
              quantity
            }
          })
        )

        // Create enriched order with full product details
        const enrichedOrder: EnrichedOrder = {
          ...orderData,
          products: enrichedProducts
        }

        setOrder(enrichedOrder)
      } catch (err) {
        console.error('Error fetching order:', err)
        setError('No se pudo cargar el pedido. Por favor, intenta de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Cargando detalles del pedido...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Oops, algo salió mal</h2>
        <p className="text-muted-foreground mb-4">{error || 'No se pudo encontrar el pedido.'}</p>
        <Button onClick={() => router.push('/orders')}>Volver a mis pedidos</Button>
      </div>
    )
  }

  const subtotal = order.products.reduce((sum, product) => sum + product.price * product.quantity, 0)
  const tax = subtotal * 0

  return (
    <div className="flex flex-col min-h-full w-full">
      <header className="relative w-full bg-gradient-to-br from-[#0C4A6E] via-[#075985] to-[#0369A1] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ij48Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIvPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-white tracking-tight drop-shadow-lg">
            Detalles del Pedido
          </h1>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-8 text-white"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-current"
            />
          </svg>
        </div>
      </header>
    <div className="container mx-auto py-10">
      <Button variant="ghost" onClick={() => router.push('/orders')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver a mis pedidos
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Detalles del Pedido #{order.id}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fecha del pedido</p>
              <p className="text-lg">{format(new Date(order.creationDate), 'PPP', { locale: es })}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estado del pedido</p>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold
                ${order.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                  order.status === 'delivered' ? 'bg-blue-100 text-blue-800' : 
                  'bg-yellow-100 text-yellow-800'}`}>
                {order.status === 'confirmed' ? 'Confirmado' :
                 order.status === 'delivered' ? 'Entregado' : 'Pendiente'}
              </span>
            </div>
          </div>

          <Separator className="my-6" />

          <h3 className="text-lg font-semibold mb-4">Productos</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead></TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Precio unitario</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Image
                      src={product.photoUrl}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                  <TableCell className="text-right">{product.quantity}</TableCell>
                  <TableCell className="text-right">${product.price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${(product.price * product.quantity).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Separator className="my-6" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA</span>
              <span>${tax.toLocaleString()}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${order.total.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" disabled>
            Descargar factura
          </Button>
        </CardFooter>
      </Card>
    </div>
    </div>
  )
}