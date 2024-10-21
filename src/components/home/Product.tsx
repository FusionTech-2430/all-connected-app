'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { CheckCircle, ArrowLeft } from 'lucide-react'

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
}

interface Business {
  name: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_URL}/products-service/api/v1/products/1`)
        const data = await response.json()
        setProduct(data)

        const businessResponse = await fetch(`${API_URL}/businesses-service/api/v1/businesses/${data.idBusiness}`)
        const businessData = await businessResponse.json()
        setBusiness(businessData)
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }

    fetchProduct()
  }, [])

  if (!product || !business) return <div>Loading...</div>

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#0c4a6e] text-white p-8 flex items-center justify-center">
        <h1 className="text-3xl font-bold">Productos</h1>
      </header>

      <main className="flex-grow bg-white p-4 max-w-4xl mx-auto w-full">
        <a href="#" className="text-blue-500 mb-6 inline-flex items-center">
          <ArrowLeft className="mr-2" size={16} />
          Vuelve a todos los productos
        </a>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <Image src={product.photoUrl} alt={product.name} width={500} height={500} className="w-full h-auto" />
          </div>

          <div className="md:w-1/2">
            <p className="text-gray-500 mb-1 text-sm">{business.name}</p>
            <h2 className="text-2xl font-bold mb-2 text-[#0c4a6e]">{product.name}</h2>

            <div className="flex items-center mb-4">
              {[1, 2, 3, 4, 4.5].map((star, index) => (
                <svg key={index} className={`w-5 h-5 ${star > 4 ? 'fill-gray-300' : 'fill-yellow-400'}`} viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>

            <p className="text-gray-700 mb-4">{product.description}</p>

            <p className="text-3xl font-bold mb-4">${product.price.toLocaleString()}</p>

            <div className="flex items-center mb-4">
              <CheckCircle className="text-green-500 mr-2" />
              <span className="text-green-500">En stock</span>
            </div>

            <button className="bg-[#0284c7] text-white px-6 py-2 rounded hover:bg-[#0369a1] transition-colors w-full md:w-auto">
              Comprar
            </button>

            <p className="mt-4 text-sm text-gray-500 flex items-center">
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Reportar producto o emprendimiento
            </p>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-[#0c4a6e]">Opiniones del producto</h2>
          <p>No hay opiniones disponibles.</p>
        </div>
      </main>
    </div>
  )
}