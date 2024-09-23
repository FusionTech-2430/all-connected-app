'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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


const services = [
  { name: "Tutorias de matemáticas", category: "Educación", requests: 8 },
  { name: "Tutorias de física", category: "Educación", requests: 2 },
  { name: "Mantenimiento de PCs", category: "Ingeniería", requests: 6 },
  { name: "Diseño de logos", category: "Diseño", requests: 25 },
  { name: "Serenata", category: "Música", requests: 1 },
]

export default function MyServicesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Mis servicios</h1>
      
      <div className="flex justify-between mb-6">
        <Input placeholder="Buscar por nombre..." className="max-w-sm" />
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos los servicios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los servicios</SelectItem>
              <SelectItem value="education">Educación</SelectItem>
              <SelectItem value="engineering">Ingeniería</SelectItem>
              <SelectItem value="design">Diseño</SelectItem>
              <SelectItem value="music">Música</SelectItem>
            </SelectContent>
          </Select>
          <AddServiceModal />
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
          {services.map((service) => (
            <TableRow key={service.name}>
              <TableCell className="font-medium">{service.name}</TableCell>
              <TableCell>{service.category}</TableCell>
              <TableCell>{service.requests}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">Total: 100 eventos.</p>
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Página 1 de 10</p>
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
    </div>
  )
}