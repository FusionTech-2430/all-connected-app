'use client'

import { useEffect, useState } from 'react'
import ConsumerFAQDashboard from '@/components/consumer/faqs/FAQS'
import SearchInput from '@/components/shared/search-input'
import { FAQ } from '@/types/faq'
import { getFaqs } from '@/lib/api/faq'

export default function FaqsPageConsumer() {
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

  if (isLoading) {
    return <div></div>
  }

  return (
    <div className="w-full">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Preguntas y Respuestas Frecuentes</h1>
        <SearchInput
          className="w-full md:w-1/2 lg:w-1/3"
          paramName="search"
          placeholder="Buscar por pregunta o respuesta..."
          onChange={handleSearch}
          value={searchQuery}
        />
      </div>
      <ConsumerFAQDashboard faqs={filteredFAQs} />
    </div>
  )
}