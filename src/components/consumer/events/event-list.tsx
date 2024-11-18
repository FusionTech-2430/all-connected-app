'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'
import { EventCard } from './event-card'
import { getEvents } from '@/lib/api/events'

interface Event {
  id: number
  nombre: string
  aforo: number
  fecha: Date
}

export default function EventsList() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedEvents = await getEvents()
        setEvents(fetchedEvents)
      } catch (err) {
        setError('Error al cargar los datos')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredEvents = events.filter(event =>
    event.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleViewEvent = (eventId: number) => {
    router.push(`/event?id=${eventId}`)
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
          placeholder="Buscar eventos..."
          className="w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <p className="mb-4">Mostrando 1-{filteredEvents.length} de {filteredEvents.length} resultados</p>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pr-40">
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onViewEvent={handleViewEvent}
          />
        ))}
      </div>
    </section>
  )
}
