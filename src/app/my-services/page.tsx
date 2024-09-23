'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Edit, Trash } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreHorizontal, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { AddServiceModal } from "@/components/add-service-modal"
import { EditServiceModal } from "@/components/edit-service-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Service {
  name: string;
  category: string;
  requests: number;
  description?: string;
  tags?: string;
  photo?: string;
}

const initialServices: Service[] = [
  { name: "Tutorias de matemáticas", category: "Educación", requests: 8 },
  { name: "Tutorias de física", category: "Educación", requests: 2 },
  { name: "Mantenimiento de PCs", category: "Ingeniería", requests: 6 },
  { name: "Diseño de logos", category: "Diseño", requests: 25 },
  { name: "Serenata", category: "Música", requests: 1 },
]

export default function MyServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const handleAction = (action: string, service: Service) => {
    if (action === 'modificar') {
      setSelectedService(service)
      setIsEditModalOpen(true)
    } else if (action === 'eliminar') {
      setServices(prevServices => prevServices.filter(s => s.name !== service.name))
    } else {
      console.log(`${action} service:`, service)
    }
  }

  const handleSaveService = (updatedService: Service) => {
    setServices(prevServices =>
      prevServices.map(service =>
        service.name === updatedService.name ? updatedService : service
      )
    )
  }

  const handleAddService = (newService: Service) => {
    setServices(prevServices => [...prevServices, newService])
  }

  const filteredServices = services
    .filter(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(service => categoryFilter === 'all' || service.category === categoryFilter)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Mis servicios</h1>
      
      <div className="flex justify-between mb-6">
        <Input 
          placeholder="Buscar por nombre..." 
          className="max-w-sm" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos los servicios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los servicios</SelectItem>
              <SelectItem value="Educación">Educación</SelectItem>
              <SelectItem value="Ingeniería">Ingeniería</SelectItem>
              <SelectItem value="Diseño">Diseño</SelectItem>
              <SelectItem value="Música">Música</SelectItem>
            </SelectContent>
          </Select>
          <AddServiceModal onAddService={handleAddService} />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Solicitudes</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredServices.map((service) => (
            <TableRow key={service.name}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>{service.category}</TableCell>
              <TableCell>{service.requests}</TableCell>
              <TableCell className="text-right">
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleAction('visualizar', service)}>
                      <Eye className="mr-2 h-4 w-4 text-blue-500" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('modificar', service)}>
                      <Edit className="mr-2 h-4 w-4 text-yellow-500" />
                      Modificar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('eliminar', service)}>
                      <Trash className="mr-2 h-4 w-4 text-red-500" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">Total: {filteredServices.length} servicios.</p>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Página 1 de 1</p>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <EditServiceModal
        service={selectedService}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveService}
      />
    </div>
  )
}