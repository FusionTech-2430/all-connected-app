'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'
import { ProductCard } from './product-card'
import { LabelFilter } from './label-filter'

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

export async function fetchProducts(apiUrl: string) {
  const response = await fetch(`${apiUrl}/products-service/api/v1/products`)
  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }
  return await response.json()
}

export async function fetchLabels(apiUrl: string) {
  const response = await fetch(`${apiUrl}/products-service/api/v1/labels`)
  if (!response.ok) {
    throw new Error('Failed to fetch labels')
  }
  return await response.json()
}

export async function fetchProductRating(apiUrl: string, productId: number) {
  try {
    const response = await fetch(`${apiUrl}/products-service/api/v1/products/rating/${productId}/average`)
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

export default function ProductList() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [labels, setLabels] = useState<Label[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedProducts, fetchedLabels] = await Promise.all([
          fetchProducts(API_URL),
          fetchLabels(API_URL)
        ])
        const productsWithRatings = await Promise.all(fetchedProducts.map(async (product: Product) => {
          const rating = await fetchProductRating(API_URL, product.id)
          return { ...product, rating }
        }))
        setProducts(productsWithRatings)
        setLabels(fetchedLabels)
      } catch (err) {
        setError('Error al cargar los datos')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

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
    <section className="w-full p-5">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Buscar productos..."
          className="w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <p className="mb-4">Mostrando 1-{filteredProducts.length} de {filteredProducts.length} resultados</p>

      <div className="flex flex-col md:flex-row md:gap-6">
        <LabelFilter 
          labels={labels}
          selectedLabels={selectedLabels}
          onLabelChange={handleLabelChange}
        />

        <div className="w-full md:w-4/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pr-40">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
              onViewProduct={handleViewProduct}
            />
          ))}
        </div>
      </div>
    </section>
  )
}