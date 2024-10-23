'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createOrganization } from '@/lib/api/organizations'
import type { Organizations } from '@/types/organizations'
import { toast } from 'sonner'

interface CreateOrganizationButtonProps {
  onOrganizationCreated: (newOrganization: Organizations) => void
}

export function CreateOrganizationButton({
  onOrganizationCreated
}: CreateOrganizationButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleOpenDialog = () => setIsDialogOpen(true)
  const handleCloseDialog = () => setIsDialogOpen(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formElement = event.currentTarget
    const formData = new FormData(formElement)

    if (selectedFile) {
      formData.set('photo_url', selectedFile)
    }

    try {
      const newOrganization = await createOrganization(formData)
      onOrganizationCreated(newOrganization)
      toast.success('Organización creada exitosamente')
      handleCloseDialog()
    } catch (error) {
      console.error('Error creating organization:', error)
      toast.error('Error al crear la organización')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button onClick={handleOpenDialog}>Añadir</Button>
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              Crea una nueva organización
            </DialogTitle>
            <DialogDescription>
              Llena el formulario con la información de la organización
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                placeholder="Nombre de la organización"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                name="address"
                placeholder="Dirección de la organización"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location_lat">Latitud</Label>
              <Input
                id="location_lat"
                name="location_lat"
                placeholder="Ej: 4.6382"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location_lng">Longitud</Label>
              <Input
                id="location_lng"
                name="location_lng"
                placeholder="Ej: -74.0826"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="photo_url">Logo</Label>
              <Input
                id="photo_url"
                name="photo_url"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear organización'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
