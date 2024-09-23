'use client'

import { useState } from 'react'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const events = [
  { name: 'Tutorías de matemáticas', category: 'Educación', requests: 8 },
  { name: 'Tutorías de física', category: 'Educación', requests: 2 },
  { name: 'Mantenimiento de PCs', category: 'Ingeniería', requests: 6 },
  { name: 'Diseño de logos', category: 'Diseño', requests: 25 },
  { name: 'Serenata', category: 'Música', requests: 1 }
]

export default function Component() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <section className="flex-1 p-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <Input
            type="text"
            placeholder="Buscar por nombre..."
            className="w-full md:w-1/3 mb-4 md:mb-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Select>
              <option>Todos los servicios</option>
            </Select>
            <Button className="bg-blue-500 text-white hover:bg-blue-600">
              <Search className="w-4 h-4 mr-2" />
              Añadir
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 text-gray-700">Nombre</th>
                <th className="text-left py-2 text-gray-700">Categoría</th>
                <th className="text-left py-2 text-gray-700">Solicitudes</th>
                <th className="text-left py-2 text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {events
                .filter((event) =>
                  event.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((event, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 text-gray-900">{event.name}</td>
                    <td className="py-2 text-gray-900">{event.category}</td>
                    <td className="py-2 text-gray-900">{event.requests}</td>
                    <td className="py-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost">...</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" /> Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" /> Modificar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center mt-4">
          <span className="text-gray-700 mb-2 md:mb-0">
            Total: 100 eventos.
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-gray-700">Página 1 de 10</span>
            <Button variant="outline" size="icon" className="text-gray-700">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="text-gray-700">
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="text-gray-700">
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
