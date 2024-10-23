'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Loader2, Star } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface Product {
  id: number
  idBusiness: string
  name: string
  description: string
  photoUrl: string | null
  stock: number
  price: number
  status: string
  labels: string[]
  rating?: number
}

interface Label {
  id: number
  label: string
}

export default function ProductList() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [labels, setLabels] = useState<Label[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
    fetchLabels()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products-service/api/v1/products`)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      const productsWithRatings = await Promise.all(data.map(async (product: Product) => {
        const rating = await fetchProductRating(product.id)
        return { ...product, rating }
      }))
      setProducts(productsWithRatings)
    } catch (err) {
      setError('Error al cargar los productos')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProductRating = async (productId: number) => {
    try {
      const response = await fetch(`${API_URL}/products-service/api/v1/products/rating/${productId}/average`)
      if (!response.ok) {
        return null
      }
      const data = await response.json()
      if (data.code === 200 && data.message) {
        const ratingMatch = data.message.match(/(\d+(\.\d+)?)/)
        return ratingMatch ? parseFloat(ratingMatch[1]) : null
      }
      return null
    } catch (err) {
      console.error(`Error fetching rating for product ${productId}:`, err)
      return null
    }
  }

  const fetchLabels = async () => {
    try {
      const response = await fetch(`${API_URL}/products-service/api/v1/labels`)
      if (!response.ok) {
        throw new Error('Failed to fetch labels')
      }
      const data = await response.json()
      setLabels(data)
    } catch (err) {
      console.error('Error fetching labels:', err)
    }
  }

  const handleLabelChange = (label: string) => {
    setSelectedLabels(prev =>
      prev.includes(label)
        ? prev.filter(l => l !== label)
        : [...prev, label]
    )
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedLabels.length === 0 || product.labels.some(label => selectedLabels.includes(label)))
  )

  const renderStars = (rating: number) => {
    return (
      <div className="flex justify-center">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-5 h-5 ${index < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    )
  }

  const handleViewProduct = (productId: number) => {
    router.push(`/product?id=${productId}`)
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
    <section className="w-4/5 p-5">
      <div className="flex justify-between items-center mb-4">
        <p>Mostrando 1-{filteredProducts.length} de {filteredProducts.length} resultados</p>
        <Input
          type="text"
          placeholder="Buscar productos..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex mb-4">
        <div className="w-1/4 pr-4">
          <h3 className="font-bold mb-2">Filtrar por etiquetas:</h3>
          {labels.map((label) => (
            <div key={label.id} className="flex items-center mb-2">
              <Checkbox
                id={`label-${label.id}`}
                checked={selectedLabels.includes(label.label)}
                onCheckedChange={() => handleLabelChange(label.label)}
              />
              <Label htmlFor={`label-${label.id}`} className="ml-2">
                {label.label}
              </Label>
            </div>
          ))}
        </div>

        <div className="w-3/4 grid grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="border p-4 flex flex-col items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="w-full h-48 mb-4 cursor-pointer overflow-hidden">
                    {product.photoUrl ? (
                      <Image
                        src={product.photoUrl}
                        alt={product.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        No image
                      </div>
                    )}
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl">
                  {product.photoUrl && (
                    <Image
                      src={product.photoUrl}
                      alt={product.name}
                      width={800}
                      height={600}
                      className="w-full h-auto"
                    />
                  )}
                </DialogContent>
              </Dialog>
              <h4 className="font-semibold text-center">{product.name}</h4>
              <p className="text-sm text-gray-600 mb-2 text-center">{product.description}</p>
              <p className="text-xl font-bold mb-2">${product.price.toLocaleString()}</p>
              {product.rating !== null && product.rating !== undefined && (
                <div className="mb-2">
                  <p className="text-sm text-gray-600 text-center">Rating: {product.rating.toFixed(1)}</p>
                  {renderStars(product.rating)}
                </div>
              )}
              <Button className="w-full" onClick={() => handleViewProduct(product.id)}>Ver Producto</Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}