'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import {
  CheckCircle,
  Minus,
  Plus,
  Star,
  Loader2,
  AlertTriangle,
  XCircle
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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { useUserId } from '@/hooks/use-user-id'
import { getProductById, getProductRating, getRatingsByProduct, addRating, createProductReport } from '@/lib/api/products'
import { getBusiness } from '@/lib/api/business'
import { getOrdersByUser } from '@/lib/api/orders'
import { createOrder, addProductToOrder } from '@/lib/api/orders'
import {getUser} from "@/lib/api/users"
import { createChat } from '@/services/chatService'

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

interface Rating {
  idRating: number
  userId: string
  rating: number
  comment: string
  date: Date
}

interface RatingShow {
  idRating: number
  username: string
  rating: number
  comment: string
  date: string
}

interface RatingCreateDTO {
  productId: number
  userId: string
  rating: number
  comment: string
}

interface ProductReportDTO {
  category: string
  productId: number
  reason: string
  description: string
  reportDate: Date
}

export default function ProductPage() {
  const searchParams = useSearchParams()
  const productId = searchParams.get('id')

  const [product, setProduct] = useState<Product | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [ratings, setRatings] = useState<RatingShow[]>([])
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
  const [reportErrorMessage, setReportErrorMessage] = useState('')
  const [newRating, setNewRating] = useState<RatingCreateDTO>({
    productId: 0,
    userId: '',
    rating: 0,
    comment: ''
  })
  const [shouldReload, setShouldReload] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [reportData, setReportData] = useState<ProductReportDTO>({
    category: '',
    productId: 0,
    reason: '',
    description: '',
    reportDate: new Date()
  })

  const userId = useUserId()

  useEffect(() => {
    if (productId) {
      fetchProduct(parseInt(productId))
      fetchRatings(parseInt(productId))
    }
  }, [productId])

  useEffect(() => {
    if (shouldReload) {
      window.location.reload()
    }
  }, [shouldReload])

  const fetchProduct = async (id: number) => {
    setIsLoading(true)
    try {
      const productData = await getProductById(id)

      if (!productData) {
        throw new Error("Producto no encontrado")
      }

      const businessData = await getBusiness(productData.idBusiness)

      const ratingResponse = await getProductRating(id)
      const rating = ratingResponse.message ? parseFloat(ratingResponse.message.split(' ')[2]) : 0

      setProduct({ ...productData, rating })
      setBusiness(businessData)
    } catch (error) {
      console.error("Error fetching product:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo cargar el producto",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRatings = async (id: number) => {
    try {
      const ratingsData = await getRatingsByProduct(id.toString())

      const formattedRatings = await Promise.all(
        ratingsData.map(async (rating: Rating) => {
          try {
            const user = await getUser(rating.userId)
            return {
              idRating: rating.idRating,
              username: user.username || "Usuario Desconocido",
              rating: rating.rating,
              comment: rating.comment,
              date: rating.date ? new Date(rating.date).toLocaleDateString() : "Fecha no disponible",
            }
          } catch (error) {
            console.error(`Error al obtener el usuario para el rating ${rating.idRating}:`, error)
            return {
              idRating: rating.idRating,
              username: "Usuario desconocido",
              rating: rating.rating,
              comment: rating.comment,
              date: rating.date ? new Date(rating.date).toLocaleDateString() : "Fecha no disponible",
            }
          }
        })
      )

      setRatings(formattedRatings)
    } catch (error) {
      console.error("Error al obtener las calificaciones:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las opiniones",
        variant: "destructive",
      })
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
      })
      return
    }

    if (product.stock <= 0) {
      toast({
        title: 'Error',
        description: 'Este producto está agotado',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      let orderId = sessionStorage.getItem('orderId')

      if (!orderId) {
        const userOrders = await getOrdersByUser(userId)
        const activeOrder = userOrders.find((order) => order.status === 'in_progress')
        if (activeOrder) {
          orderId = activeOrder.id
          sessionStorage.setItem('orderId', orderId)
        } else {
          const orderData = await createOrder({
            idUser: userId,
            idBusiness: product.idBusiness,
          })

          orderId = orderData.id
          sessionStorage.setItem('orderId', orderId)
        }
      }

      await addProductToOrder(orderId, product.id, quantity)

      toast({
        title: 'Éxito',
        description: 'Producto agregado a la orden correctamente',
      })
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error procesando la compra:', error)
      toast({
        title: 'Error',
        description: 'Error al procesar la compra',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
      window.location.reload()
    }
  }

  const handleCreateRating = async () => {
    if (!userId || !product) {
      toast({
        title: 'Error',
        description: 'Usuario o producto no disponible',
        variant: 'destructive',
      })
      return
    }

    // Validación de campos
    if (newRating.rating === 0) {
      toast({
        title: 'Error',
        description: 'Por favor seleccione una calificación',
        variant: 'destructive',
      })
      return
    }

    if (!newRating.comment.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor ingrese un comentario',
        variant: 'destructive',
      })
      return
    }

    try {
      const ratingData: RatingCreateDTO = {
        productId: product.id,
        userId: userId,
        rating: newRating.rating,
        comment: newRating.comment,
      }

      const response = await addRating(product.id.toString(), ratingData)

      if (response) {
        toast({
          title: 'Éxito',
          description: 'Calificación agregada correctamente',
          className: 'bg-[#0EA5E9] text-white',
        })
        setShouldReload(true)
        setIsRatingModalOpen(false)
        fetchRatings(product.id)
      }
    } catch (error) {
      console.error('Error al crear la calificación:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'No se pudo agregar la calificación',
        variant: 'destructive',
      })
    }
  }

  const handleCreateReport = async () => {
    setReportErrorMessage('')

    if (!product) {
      setReportErrorMessage('Producto no disponible')
      return
    }

    // Validación de campos
    if (!reportData.category) {
      setReportErrorMessage('Por favor seleccione una categoría')
      return
    }

    if (!reportData.reason) {
      setReportErrorMessage('Por favor seleccione una razón')
      return
    }

    if (!reportData.description.trim()) {
      setReportErrorMessage('Por favor ingrese una descripción')
      return
    }

    try {
      await createProductReport(product.id, {
        ...reportData,
        productId: product.id,
        reportDate: new Date(),
      })

      setReportErrorMessage('')
      setIsReportModalOpen(false)
      setReportData({
        category: '',
        productId: 0,
        reason: '',
        description: '',
        reportDate: new Date(),
      })
    } catch (error: unknown) {
      console.error("Error al crear el reporte:", error)

      if (error instanceof Error && error.message.includes("duplicate key")) {
        setReportErrorMessage("El producto ya se encuentra reportado, el equipo de AllConnected está evaluando el caso.")
      } else {
        setReportErrorMessage("No se pudo enviar el reporte. Por favor intente nuevamente.")
      }
    }
  }

  const handleChat = () => {
    if (!userId || !product) {
      toast({
        title: 'Error',
        description: 'Usuario o producto no disponible',
        variant: 'destructive',
      })
      return
    }
    const chatId = createChat("Compra producto "+product?.name, userId, product.idBusiness)
    console.log(chatId)
    window.location.href = '/consumer/messages/chat?id=' + chatId
  }


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
                <div className="mt-2">
                  {product.stock > 0 ? (
                    <div className="flex items-center text-green-500">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="font-medium">En stock</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <XCircle className="w-5 h-5 mr-2" />
                      <span className="font-medium">Sin stock</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  className="w-full py-6 text-lg bg-[#0EA5E9] hover:bg-[#0284C7] text-white"
                  onClick={() => setIsModalOpen(true)}
                  disabled={product.stock <= 0}
                >
                  {product.stock > 0 ? 'Comprar' : 'Agotado'}
                </Button>

                <button
                  className="w-full text-sm text-gray-500 flex  items-center justify-center hover:text-gray-700"
                  onClick={() => setIsReportModalOpen(true)}
                >
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Reportar producto o emprendimiento
                </button>
                <Button
                  className="w-auto py-2 px-4 text-sm bg-[#38BDF8] hover:bg-[#0EA5E9] text-white flex items-center justify-center ml-auto"
                  onClick={handleChat}
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  Chatea con el Proveedor
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Opiniones del Producto</h2>
              <Button
                onClick={() => setIsRatingModalOpen(true)}
                className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white"
              >
                Crear Calificación
              </Button>
            </div>
            {ratings.length > 0 ? (
              <table className="min-w-full bg-white border border-gray-200 rounded-md">
                <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-gray-600">Usuario</th>
                  <th className="px-4 py-2 text-left text-gray-600">Calificación</th>
                  <th className="px-4 py-2 text-left text-gray-600">Comentario</th>
                  <th className="px-4 py-2 text-left text-gray-600">Fecha</th>
                </tr>
                </thead>
                <tbody>
                {ratings.map((rating) => (
                  <tr key={rating.idRating} className="border-t">
                    <td className="px-4 py-2">{rating.username}</td>
                    <td className="px-4 py-2">{renderStars(rating.rating)}</td>
                    <td className="px-4 py-2">{rating.comment}</td>
                    <td className="px-4 py-2">{new Date(rating.date).toLocaleDateString()}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No hay opiniones disponibles.</p>
            )}
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
                  disabled={quantity <= 1 || product.stock <= 0}
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
                  disabled={product.stock <= 0}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock || product.stock <= 0}
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
            <Button 
              onClick={handlePurchase} 
              disabled={isLoading || product.stock <= 0}
              className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white"
            >
              {isLoading ? 'Procesando...' : (product.stock > 0 ? 'Confirmar Compra' : 'Agotado')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRatingModalOpen} onOpenChange={setIsRatingModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Crear Calificación
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Calificación
              </label>
              <div className="flex mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 cursor-pointer ${
                      star <= newRating.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                    onClick={() => setNewRating({ ...newRating, rating: star })}
                  />
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                Comentario
              </label>
              <Textarea
                id="comment"
                value={newRating.comment}
                onChange={(e) => setNewRating({ ...newRating, comment: e.target.value })}
                rows={4}
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:border-[#0EA5E9] focus:ring-[#0EA5E9]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRatingModalOpen(false)}
              className="text-gray-700 border-gray-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateRating}
              className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white"
            >
              Enviar Calificación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Reportar Producto
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {reportErrorMessage && (
              <p className="text-red-600 text-sm">{reportErrorMessage}</p>
            )}
            <div className="grid gap-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={reportData.category}
                onValueChange={(value) => setReportData({ ...reportData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Seleccione una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inappropriate">Contenido inapropiado</SelectItem>
                  <SelectItem value="fake">Producto falso</SelectItem>
                  <SelectItem value="scam">Posible estafa</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">Razón</Label>
              <Select
                value={reportData.reason}
                onValueChange={(value) => setReportData({ ...reportData, reason: value })}
              >
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Seleccione una razón" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="misleading">Información engañosa</SelectItem>
                  <SelectItem value="offensive">Contenido ofensivo</SelectItem>
                  <SelectItem value="illegal">Producto ilegal</SelectItem>
                  <SelectItem value="quality">Problemas de calidad</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describa el problema en detalle"
                value={reportData.description}
                onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                className="h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateReport} className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white">
              Enviar Reporte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}