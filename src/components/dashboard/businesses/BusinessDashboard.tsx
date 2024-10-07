'use client'

import React, { useState, useEffect } from 'react'
import { Avatar } from '@/components/ui/avatar'
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
import { Eye, Trash2, MoreVertical, Upload } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import { Select } from '@/components/ui/select'

interface Ally {
  id: string;
  name: string;
  email: string;
}

// Mock data for allies
const initialAllies: Ally[] = [
  { id: 'CN', name: 'Camilo Nossa', email: 'camilonossa@fusiontech.com' },
  { id: 'VE', name: 'Valentina Escobar', email: 'valen_e@fusiontech.com' },
  { id: 'DP', name: 'Diego Pardo', email: 'pardiego@fusiontech.com' },
  { id: 'CR', name: 'Carlos Rojas', email: 'carlosroj@fusiontech.com' },
  { id: 'ES', name: 'Esteban Salazar', email: 'estebans@fusiontech.com' }
]

export default function BusinessDashboard() {
  const [allies, setAllies] = useState<Ally[]>(initialAllies)
  const [searchTerm, setSearchTerm] = useState('')
  const [businessImage, setBusinessImage] = useState('/placeholder.svg?height=48&width=48')
  const [isOwnershipModalOpen, setIsOwnershipModalOpen] = useState(false)
  const [isAddAllyModalOpen, setIsAddAllyModalOpen] = useState(false)
  const [isViewAllyModalOpen, setIsViewAllyModalOpen] = useState(false)
  const [isDeleteAllyModalOpen, setIsDeleteAllyModalOpen] = useState(false)
  const [selectedAlly, setSelectedAlly] = useState<Ally | null>(null)
  const [newOwner, setNewOwner] = useState('')
  const [temporaryToken, setTemporaryToken] = useState('')

  useEffect(() => {
    const filteredAllies = initialAllies.filter(ally =>
      ally.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ally.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setAllies(filteredAllies)
  }, [searchTerm])

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setBusinessImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const openViewAllyModal = (ally: Ally) => {
    setSelectedAlly(ally)
    setIsViewAllyModalOpen(true)
  }

  const openDeleteAllyModal = (ally: Ally) => {
    setSelectedAlly(ally)
    setIsDeleteAllyModalOpen(true)
  }

  const deleteAlly = () => {
    if (selectedAlly) {
      setAllies(allies.filter(a => a.id !== selectedAlly.id))
      setIsDeleteAllyModalOpen(false)
    }
  }

  const generateToken = () => {
    const token = Math.random().toString(36).substr(2, 8)
    setTemporaryToken(token)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mi Emprendimiento</h1>

      <div className="bg-blue-50 p-4 rounded-lg flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Avatar className="w-12 h-12">
            <img src={businessImage} alt="Pontigomitas logo" className="w-full h-full object-cover" />
          </Avatar>
          <div>
            <h2 className="font-semibold">Pontigomitas</h2>
            <p className="text-sm text-gray-500">Dueña</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => document.getElementById('imageUpload')?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Cambiar imagen
          </Button>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
          <Button variant="outline" onClick={() => setIsOwnershipModalOpen(true)}>
            Ceder título propietario
          </Button>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-4">Gestión de aliados</h3>

      <div className="flex space-x-4 mb-4">
        <Input
          className="flex-grow"
          placeholder="Buscar por nombre o correo..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        />
        <Button onClick={() => setIsAddAllyModalOpen(true)}>Añadir Aliado</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allies.map((ally) => (
            <TableRow key={ally.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">{ally.id}</Avatar>
                  <div>
                    <p>{ally.name}</p>
                    <p className="text-sm text-gray-500">{ally.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost"><MoreVertical className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => openViewAllyModal(ally)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openDeleteAllyModal(ally)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4">
        <p className="text-sm text-gray-500">Total: {allies.length} aliados.</p>
      </div>

      {/* Ownership Transfer Modal */}
      <Dialog open={isOwnershipModalOpen} onOpenChange={setIsOwnershipModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ceder título de propietario</DialogTitle>
            <DialogDescription>
              Seleccione el nuevo propietario del emprendimiento.
            </DialogDescription>
          </DialogHeader>
          <Select value={newOwner} onValueChange={setNewOwner}>
            <option value="">Seleccione un aliado</option>
            {allies.map(ally => (
              <option key={ally.id} value={ally.id}>{ally.name}</option>
            ))}
          </Select>
          <DialogFooter>
            <Button onClick={() => {
              // Logic to change ownership
              setIsOwnershipModalOpen(false)
            }}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Ally Modal */}
      <Dialog open={isAddAllyModalOpen} onOpenChange={setIsAddAllyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir Aliado</DialogTitle>
            <DialogDescription>
              Genere un token temporal para invitar a un nuevo aliado.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={generateToken}>Generar y enviar un token</Button>
          {temporaryToken && (
            <div>
              <p>Token generado: {temporaryToken}</p>
              <Button onClick={() => navigator.clipboard.writeText(temporaryToken)}>
                Copiar Token
              </Button>
            </div>
          )}
          <DialogClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* View Ally Modal */}
      <Dialog open={isViewAllyModalOpen} onOpenChange={setIsViewAllyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Información del Aliado</DialogTitle>
          </DialogHeader>
          {selectedAlly && (
            <div>
              <p><strong>Nombre:</strong> {selectedAlly.name}</p>
              <p><strong>Email:</strong> {selectedAlly.email}</p>
            </div>
          )}
          <DialogClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      {/* Delete Ally Modal */}
      <Dialog open={isDeleteAllyModalOpen} onOpenChange={setIsDeleteAllyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Aliado</DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar a este aliado?
            </DialogDescription>
          </DialogHeader>
          {selectedAlly && (
            <p>Aliado a eliminar: {selectedAlly.name}</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteAllyModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={deleteAlly}>
              Confirmar Eliminación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}