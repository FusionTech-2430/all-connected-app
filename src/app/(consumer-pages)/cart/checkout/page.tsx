'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getOrderById, confirmOrder } from '@/lib/api/orders'
import { getProductById } from '@/lib/api/products'
import { OrderDTO } from '@/types/orders/orders'
import { Products } from '@/types/products'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, CreditCard, ShoppingCart } from 'lucide-react'
import Link from 'next/link'

interface CartItem {
  product: Products
  quantity: number
}

export default function CheckoutPage() {
  const [order, setOrder] = useState<OrderDTO | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchOrder() {
      const orderId = sessionStorage.getItem('orderId')
      if (!orderId) {
        setLoading(false)
        return
      }

      try {
        const orderData = await getOrderById(orderId)
        setOrder(orderData)

        const items: CartItem[] = await Promise.all(
          Object.entries(orderData.products).map(async ([productId, quantity]) => {
            const product = await getProductById(Number(productId))
            return { product, quantity }
          })
        )

        setCartItems(items)
      } catch (error) {
        console.error('Error fetching order details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [])

  const handlePayment = async () => {
    if (!order) return
    confirmOrder(order.id)
        .then(() => {
            sessionStorage.removeItem('orderId')
            router.push('/consumer')
        })
        .catch((error) => {
            console.error('Error confirming order:', error)
        })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Cargando detalles del pedido...</p>
      </div>
    )
  }

  if (!order || cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-semibold mb-4">No hay pedido para procesar</h2>
        <Button onClick={() => router.push('/consumer')}>Volver a la tienda</Button>
      </div>
    )
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = subtotal * 0
  const total = subtotal + tax

  return (
    <div className="flex flex-col min-h-full w-full">
      <header className="relative w-full bg-gradient-to-br from-[#0C4A6E] via-[#075985] to-[#0369A1] overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ij48Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIvPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-white tracking-tight drop-shadow-lg">
            Checkout
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
      <div className="px-6 py-4 bg-gray-50 border-b">
          <Link href="/cart" passHref>
            <Button variant="outline" size="sm">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Volver al carrito
            </Button>
          </Link>
        </div>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Resumen del Pedido</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-500">
                  <th className="pb-2">Producto</th>
                  <th className="pb-2 text-right">Cantidad</th>
                  <th className="pb-2 text-right">Precio</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <tr key={item.product.id}>
                    <td className="py-3">{item.product.name}</td>
                    <td className="py-3 text-right">{item.quantity}</td>
                    <td className="py-3 text-right">${item.product.price.toLocaleString()}</td>
                    <td className="py-3 text-right">${(item.product.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>

          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>IVA</span>
              <span>${tax.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${total.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" onClick={handlePayment}>
            <CreditCard className="mr-2 h-4 w-4" /> Pagar ${total.toLocaleString()}
          </Button>
        </CardFooter>
      </Card>
    </div>
    </div>
  )
}