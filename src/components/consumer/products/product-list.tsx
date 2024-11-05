'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'
import { ProductCard } from './product-card'
import { LabelFilter } from './label-filter'
import { getProducts, getProductRating } from '@/lib/api/products'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedProducts = await getProducts()
        const productsWithRatings = await Promise.all(fetchedProducts.map(async (product: Product) => {
          const ratingResponse = await getProductRating(product.id)
          const rating = ratingResponse.message ? parseFloat(ratingResponse.message.split(' ')[2]) : 0
          return { ...product, rating }
        }))
        setProducts(productsWithRatings)
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

  const uniqueLabels: Label[] = Array.from(new Set(products.flatMap(product => product.labels)))
    .map((label, index) => ({ id: index, label }))

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
          labels={uniqueLabels}
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