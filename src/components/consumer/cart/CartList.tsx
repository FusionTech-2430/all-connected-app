'use client'

import { useEffect, useState } from 'react'
import { getOrderById, addProductToOrder, removeProductFromOrder } from '@/lib/api/orders'
import { getProductById } from '@/lib/api/products'
import { OrderDTO } from '@/types/orders/orders'
import { Products } from '@/types/products'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ShoppingCart, Minus, Plus, Trash2, PackageOpen, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface CartItem {
  product: Products
  quantity: number
}

export default function CartList() {
  const [order, setOrder] = useState<OrderDTO | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

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
        console.error('Error fetching cart details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [])

  const handleRemoveProduct = async (productId: number) => {
    if (!order) return
    try {
      await removeProductFromOrder(order.id, productId)
      const updatedItems = cartItems.filter(item => item.product.id !== productId)
      setCartItems(updatedItems)
    
      // Recalculate the total
      const newTotal = updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      setOrder(prevOrder => ({ ...prevOrder!, total: newTotal }))

      window.location.reload()
    } catch (error) {
      console.error('Error removing product from order:', error)
    }
  }

  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (!order || newQuantity <= 0) return

    try {
      await addProductToOrder(order.id, productId, newQuantity)
      const updatedItems = cartItems.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
      setCartItems(updatedItems)
    
      // Recalculate the total
      const newTotal = updatedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      setOrder(prevOrder => ({ ...prevOrder!, total: newTotal }))
    } catch (error) {
      console.error('Error updating product quantity:', error)
    }
  }

  const goToPayment = () => {
    window.location.href = '/cart/checkout'
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-lg text-muted-foreground">Cargando tu carrito...</p>
      </div>
    )
  }

  if (!order || cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <PackageOpen className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Tu carrito está vacío</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Agrega algunos productos para comenzar
        </p>
        <Button onClick={() => window.history.back()}>
          Continuar comprando
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">Tu Carrito</h2>
          </div>
        </div>

        <ScrollArea className="h-[400px] p-6">
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                  <Image
                    src={item.product.photoUrl}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-base font-medium text-gray-900">
                        {item.product.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Precio unitario: ${item.product.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="text-base font-medium text-gray-900">
                      ${(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveProduct(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-medium">Subtotal</span>
            <span className="text-lg font-semibold">${order?.total.toLocaleString()}</span>
          </div>
          <Separator className="my-4" />
          <div className="flex items-center justify-between mb-6">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary">
              ${order?.total.toLocaleString()}
            </span>
          </div>
          <Button className="w-full" size="lg" onClick={goToPayment}>
            Proceder al pago
          </Button>
        </div>
      </div>
    </div>
  )
}