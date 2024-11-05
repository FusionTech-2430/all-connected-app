'use client'

import { useEffect, useState } from 'react'
import AdminFAQDashboard from '@/components/dashboard/faqs/AdminFAQDashboard'
import SearchInput from '@/components/shared/search-input'
import { FAQ } from '@/types/faq'
import { CreateFAQButton } from '@/components/faq/create-faq-button'
import { getFaqs } from '@/lib/api/faq'

export default function AdminFAQ() {
  const [faqs, setFAQs] = useState<FAQ[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const fetchedFAQs = await getFaqs()
        setFAQs(Array.isArray(fetchedFAQs) ? fetchedFAQs : [])
      } catch (error) {
        console.error('Failed to fetch FAQs:', error)
        setFAQs([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchFAQs()
  }, [])

  const filteredFAQs = faqs.filter(
    (faq) =>
      (faq.pregunta &&
        faq.pregunta.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (faq.respuesta &&
        faq.respuesta.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleSearch = (value: string) => {
    setSearchQuery(value)
  }

  const handleFAQCreated = (newFAQ: FAQ) => {
    setFAQs((prevFAQs) => [...prevFAQs, newFAQ])
  }

  const handleFAQUpdated = (updatedFAQ: FAQ) => {
    setFAQs((prevFAQs) =>
      prevFAQs.map((f) => (f.id === updatedFAQ.id ? updatedFAQ : f))
    )
  }

  const handleFAQDeleted = (faqId: number) => {
    setFAQs((prevFAQs) => prevFAQs.filter((f) => f.id !== faqId))
  }

  if (isLoading) {
    return <div>Loading FAQs...</div>
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          Gestión de preguntas frecuentes
        </h1>
        <div className="flex justify-between items-center">
          <SearchInput
            className="w-1/3"
            paramName="search"
            placeholder="Buscar por pregunta o respuesta..."
            onChange={handleSearch}
            value={searchQuery}
          />
          <CreateFAQButton onFAQCreated={handleFAQCreated} />
        </div>
      </div>
      <AdminFAQDashboard
        faqs={filteredFAQs}
        onFAQUpdated={handleFAQUpdated}
        onFAQDeleted={handleFAQDeleted}
      />
    </>
  )
}