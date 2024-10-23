'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { updateOrganization } from '@/lib/api/organizations'
import type { Organizations } from '@/types/organizations'

interface EditOrganizationButtonProps {
  organization: Organizations
  onEditSuccess: (updatedOrganization: Organizations) => void
}

export function EditOrganizationButton({
  organization,
  onEditSuccess
}: EditOrganizationButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const handleOpenDialog = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDialogOpen(true)
  }
  const handleCloseDialog = () => setIsDialogOpen(false)

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0])
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formElement = event.currentTarget
    const formData = new FormData(formElement)

    if (selectedImage) {
      formData.set('photo_url', selectedImage)
    }

    try {
      const updatedOrganization = await updateOrganization(
        organization.id_organization,
        formData
      )
      onEditSuccess(updatedOrganization)
      handleCloseDialog()
    } catch (error) {
      console.error('Error updating organization:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <DropdownMenuItem
        className="flex items-center cursor-pointer"
        onClick={handleOpenDialog}
      >
        <Pencil className="mr-2 h-4 w-4 text-yellow-500" />
        Modificar
      </DropdownMenuItem>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              Editar organización
            </DialogTitle>
            <DialogDescription>
              Modifica la información de la organización
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                placeholder="Nombre de la organización"
                defaultValue={organization.name}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                name="address"
                placeholder="Dirección de la organización"
                defaultValue={organization.address}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location_lat">Latitud</Label>
              <Input
                id="location_lat"
                name="location_lat"
                placeholder="Latitud de la organización"
                defaultValue={organization.location_lat}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location_lng">Longitud</Label>
              <Input
                id="location_lng"
                name="location_lng"
                placeholder="Longitud de la organización"
                defaultValue={organization.location_lng}
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
                onChange={handleImageChange}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
