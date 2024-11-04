'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import {
  CheckCircle,
  Minus,
  Plus,
  Star,
  Loader2
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { useUserId } from '@/hooks/use-user-id'
import { getProductById } from '@/lib/api/products'
import { getBusiness } from '@/lib/api/business'
import { createOrder, addProductToOrder } from '@/lib/api/orders'

interface Product {
  id: number
  idBusiness: string
  name: string
  description: string
  photoUrl: string
  stock: number
  price: number
  status: string
  labels: string[]
  rating?: number
}

interface Business {
  name: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export default function ProductPage() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')

  const [product, setProduct] = useState<Product | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const userId = useUserId()

  useEffect(() => {
    if (productId) {
      fetchProduct(parseInt(productId))
    }
  }, [productId])

  const fetchProduct = async (id: number) => {
    try {
      const productData = await getProductById(id);
      setProduct(productData);

      const businessData = await getBusiness(productData.idBusiness);
      setBusiness(businessData)

      const ratingResponse = await fetch(
        `${API_URL}/products-service/api/v1/products/rating/${id}/average`
      )
      if (ratingResponse.ok) {
        const ratingData = await ratingResponse.json()
        if (ratingData.code === 200 && ratingData.message) {
          const ratingMatch = ratingData.message.match(/(\d+(\.\d+)?)/)
          if (ratingMatch) {
            setProduct((prev) => ({
              ...prev!,
              rating: parseFloat(ratingMatch[1])
            }))
          }
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      toast({
        title: 'Error',
        description: 'No se pudo cargar el producto',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) =>
      Math.max(1, Math.min(prev + amount, product?.stock || 1))
    )
  }

  const handlePurchase = async () => {
    if (!userId || !product) {
      toast({
        title: 'Error',
        description: 'Usuario o producto no disponible',
        variant: 'destructive',
      });
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Verificar si ya existe una orden en sessionStorage
      let orderId = sessionStorage.getItem('orderId');
  
      // Si no hay una orden existente, crear una nueva
      if (!orderId) {
        const orderData = await createOrder({
          idUser: userId,
          idBusiness: product.idBusiness,
        });
  
        // Guardar el ID de la nueva orden en sessionStorage
        orderId = orderData.id;
        sessionStorage.setItem('orderId', orderId);
      }
  
      // Agregar producto a la orden existente o nueva
      await addProductToOrder(orderId, product.id, quantity);
  
      toast({
        title: 'Éxito',
        description: 'Producto agregado a la orden correctamente',
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error procesando la compra:', error);
      toast({
        title: 'Error',
        description: 'Error al procesar la compra',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      // reload the page to update the cart button
      window.location.reload();
    }
  };
  

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 ${index < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!product || !business) return <div>Producto no encontrado</div>

 return (
    <div className="min-h-screen bg-gray-50"> 
      <header className="relative w-full bg-gradient-to-br from-[#0C4A6E] via-[#075985] to-[#0369A1] overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ij48Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIvPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-white tracking-tight drop-shadow-lg">
            Informacion del Producto
          </h1>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-8 text-gray-50"
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
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={product.photoUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-gray-500 text-sm">{business.name}</p>
                <h2 className="text-3xl font-bold text-gray-900 mt-1">
                  {product.name}
                </h2>
              </div>

              {product.rating && (
                <div className="flex items-center">
                  {renderStars(product.rating)}
                  <span className="ml-2 text-sm text-gray-600">
                    ({product.rating.toFixed(1)})
                  </span>
                </div>
              )}

              <p className="text-gray-700">{product.description}</p>

              <div className="border-t border-b border-gray-200 py-4">
                <p className="text-3xl font-bold text-gray-900">
                  ${product.price.toLocaleString()}
                </p>

                <div className="mt-4 flex items-center">
                  <CheckCircle className="text-green-500 mr-2" />
                  <span className="text-green-500 font-medium">En stock</span>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  className="w-full py-6 text-lg"
                  onClick={() => setIsModalOpen(true)}
                >
                  Comprar
                </Button>

                <button className="w-full text-sm text-gray-500 flex items-center justify-center hover:text-gray-700">
                  <svg
                    className="w-4 h-4 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Reportar producto o emprendimiento
                </button>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Opiniones del producto
            </h2>
            <p className="text-gray-500">No hay opiniones disponibles.</p>
          </div>
        </div>
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Compra</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <h3 className="font-semibold mb-2">{product.name}</h3>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(
                        1,
                        Math.min(parseInt(e.target.value) || 1, product.stock)
                      )
                    )
                  }
                  className="w-16 mx-2 text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="font-semibold">
                ${(product.price * quantity).toLocaleString()}
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Stock disponible: {product.stock}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handlePurchase} disabled={isLoading}>
              {isLoading ? 'Procesando...' : 'Confirmar Compra'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
