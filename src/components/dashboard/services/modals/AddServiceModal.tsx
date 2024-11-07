'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
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

interface AddServiceModalProps {
  onAddService: (newService: Service) => void
}

export function AddServiceModal({ onAddService }: AddServiceModalProps) {
  const [open, setOpen] = useState(false)
  const [newService, setNewService] = useState<Service>({
    name: '',
    category: '',
    description: '',
    tags: '',
    photo: '',
    requests: 0
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setNewService((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (value: string) => {
    setNewService((prev) => ({ ...prev, category: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddService(newService)
    setOpen(false)
    setNewService({
      name: '',
      category: '',
      description: '',
      tags: '',
      photo: '',
      requests: 0
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <span className="mr-2">+</span> Añadir
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Servicio</DialogTitle>
          <DialogDescription>
            Ingresa los detalles de tu nuevo Servicio
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
                value={newService.name}
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
                value={newService.description}
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
                value={newService.category}
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
                value={newService.tags}
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
