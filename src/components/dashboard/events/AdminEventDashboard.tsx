'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Eye, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react"

interface Event {
  id: string
  name: string
  capacity: number
  date: string
}

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([
    { id: '1', name: 'Summer Music Festival', capacity: 100, date: '21/08/2024' },
    { id: '2', name: 'Annual Developer Conference', capacity: 400, date: '12/09/2024' },
    { id: '3', name: 'City Marathon', capacity: 50, date: '16/09/2024' },
    { id: '4', name: 'Modern Art Exhibition', capacity: 20, date: '10/10/2024' },
    { id: '5', name: 'International Cuisine Expo', capacity: 800, date: '14/11/2024' },
    { id: '6', name: 'International Cuisine Expo', capacity: 800, date: '14/11/2024' },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(events.length / itemsPerPage)

  const paginatedEvents = events.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleOpenDialog = (event: Event | null = null) => {
    setCurrentEvent(event)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setCurrentEvent(null)
    setIsDialogOpen(false)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const newEvent: Event = {
      id: currentEvent?.id || String(events.length + 1),
      name: formData.get('name')?.toString() || '',
      capacity: Number(formData.get('capacity')) || 0,
      date: formData.get('date')?.toString() || '',
    }

    if (currentEvent) {
      setEvents(events.map(evt => evt.id === currentEvent.id ? newEvent : evt))
    } else {
      setEvents([...events, newEvent])
    }

    handleCloseDialog()
  }

  const handleDelete = (event: Event) => {
    setCurrentEvent(event)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (currentEvent) {
      setEvents(events.filter(evt => evt.id !== currentEvent.id))
      setCurrentEvent(null)
    }
    setIsDeleteDialogOpen(false)
  }

  const handleView = (event: Event) => {
    window.location.href = `/admin/event/${event.id}`
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Eventos</h1>
      <div className="flex justify-between mb-4">
        <Input className="w-1/3" placeholder="Buscar por nombre..." />
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Añadir
        </Button>
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
              <TableCell>{event.name}</TableCell>
              <TableCell>{event.capacity}</TableCell>
              <TableCell>{event.date}</TableCell>
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
                      <Eye className="mr-2 h-4 w-4 text-blue-500" /> {/* Change color to blue */}
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOpenDialog(event)}>
                      <Pencil className="mr-2 h-4 w-4 text-yellow-500" /> {/* Change color to yellow */}
                      Modificar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(event)}>
                      <Trash2 className="mr-2 h-4 w-4 text-red-500" /> {/* Change color to red */}
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
          {Math.min(currentPage * itemsPerPage, events.length)} de {events.length}{' '}
          eventos.
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
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              {currentEvent ? 'Editar evento' : 'Crear nuevo evento'}
            </DialogTitle>
            <DialogDescription>
              {currentEvent ? 'Modifica la información del evento' : 'Ingresa la información del nuevo evento'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" defaultValue={currentEvent?.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Aforo</Label>
              <Input id="capacity" name="capacity" type="number" defaultValue={currentEvent?.capacity} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input id="date" name="date" type="date" defaultValue={currentEvent?.date} required />
            </div>
            <Button type="submit" className="w-full">{currentEvent ? 'Guardar cambios' : 'Crear evento'}</Button>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de que quieres eliminar este evento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el evento y todos los datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}