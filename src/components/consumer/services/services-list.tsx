'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'
import { ServiceCard } from './service-card'
import { LabelFilter } from './label-filter'
import { getServices } from '@/lib/api/services'

interface Service {
  id: number
  idBusiness: string
  name: string
  description: string
  photoUrl: string | null
  status: string
  labels: string[]
}

interface Label {
  id: number
  label: string
}

export default function ServicesList() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedServices = await getServices()
        setServices(fetchedServices)
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

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedLabels.length === 0 || service.labels.some(label => selectedLabels.includes(label)))
  )

  const handleViewService = (serviceId: number) => {
    router.push(`/service?id=${serviceId}`)
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

  const uniqueLabels: Label[] = Array.from(new Set(services.flatMap(service => service.labels)))
    .map((label, index) => ({ id: index, label }))

  return (
    <section className="w-full p-5">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Buscar servicios..."
          className="w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <p className="mb-4">Mostrando 1-{filteredServices.length} de {filteredServices.length} resultados</p>

      <div className="flex flex-col md:flex-row md:gap-6">
        <LabelFilter
          labels={uniqueLabels}
          selectedLabels={selectedLabels}
          onLabelChange={handleLabelChange}
        />

        <div className="w-full md:w-4/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pr-40">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onViewService={handleViewService}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
