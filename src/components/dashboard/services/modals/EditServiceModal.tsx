'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface Service {
  name: string
  category: string
  description?: string
  tags?: string
  photo?: string
  requests: number
}

interface EditServiceModalProps {
  service: Service | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedService: Service) => void
}

export function EditServiceModal({
  service,
  isOpen,
  onClose,
  onSave
}: EditServiceModalProps) {
  const [editedService, setEditedService] = useState<Service>({
    name: '',
    category: '',
    description: '',
    tags: '',
    photo: '',
    requests: 0
  })

  useEffect(() => {
    if (service) {
      setEditedService(service)
    }
  }, [service])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setEditedService((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setEditedService((prev) => ({ ...prev, category: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(editedService)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Servicio</DialogTitle>
          <DialogDescription>
            Ingresa los detalles que quiera cambiar de tu servicio
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Servicio
              </Label>
              <Input
                id="name"
                name="name"
                value={editedService.name}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descripción
              </Label>
              <Textarea
                id="description"
                name="description"
                value={editedService.description}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Categoría
              </Label>
              <Select
                onValueChange={handleCategoryChange}
                value={editedService.category}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Educación">Educación</SelectItem>
                  <SelectItem value="Ingeniería">Ingeniería</SelectItem>
                  <SelectItem value="Diseño">Diseño</SelectItem>
                  <SelectItem value="Música">Música</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tags" className="text-right">
                Etiquetas
              </Label>
              <Input
                id="tags"
                name="tags"
                value={editedService.tags}
                onChange={handleChange}
                placeholder="Etiquetas del servicio separadas por ,"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="photo" className="text-right">
                Foto
              </Label>
              <Input
                id="photo"
                name="photo"
                type="file"
                className="col-span-3"
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Guardar Servicio
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
