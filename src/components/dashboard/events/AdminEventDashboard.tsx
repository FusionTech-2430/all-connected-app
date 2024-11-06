'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Eye, MoreHorizontal, Trash2 } from 'lucide-react'

interface Event {
  id: number
  nombre: string
  aforo: number
  fecha: string
}

export default function AdminEventDashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    const filtered = events.filter((event) =>
      event.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredEvents(filtered)
  }, [searchTerm, events])

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        'https://mockserverevents-production.up.railway.app/api/v1/eventos'
      )
      const data = await response.json()
      setEvents(data)
      setFilteredEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleDelete = (event: Event) => {
    setCurrentEvent(event)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (currentEvent) {
      try {
        await fetch(
          `https://mockserverevents-production.up.railway.app/api/v1/eventos/${currentEvent.id}`,
          {
            method: 'DELETE'
          }
        )
        fetchEvents()
      } catch (error) {
        console.error('Error deleting event:', error)
      }
    }
    setIsDeleteDialogOpen(false)
    setCurrentEvent(null)
  }

  const handleView = (event: Event) => {
    window.location.href = `/admin/event/${event.id}`
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Eventos confesiones</h1>
      <div className="flex justify-between mb-4">
        <Input
          className="w-1/3"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Aforo</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedEvents.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.nombre}</TableCell>
              <TableCell>{event.aforo}</TableCell>
              <TableCell>{event.fecha}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleView(event)}>
                      <Eye className="mr-2 h-4 w-4 text-blue-500" />
                      Ver Detalles
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(event)}>
                      <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-500">
          Mostrando {(currentPage - 1) * itemsPerPage + 1} -{' '}
          {Math.min(currentPage * itemsPerPage, filteredEvents.length)} de{' '}
          {filteredEvents.length} eventos.
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            &lt;&lt;
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </Button>
          <span className="text-sm py-2">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handlePageChange(Math.min(currentPage + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            &gt;
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            &gt;&gt;
          </Button>
        </div>
      </div>
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Estás seguro de que quieres eliminar este evento?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              el evento y todos los datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}