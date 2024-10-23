'use client'

import { useState, useEffect } from 'react'
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
import { Combobox } from '../shared/combobox'
import { getOrganizations } from '@/lib/api/organizations'
import { updateBusiness } from '@/lib/api/business'
import { Organizations } from '@/types/organizations'
import type { Business, CreateBusinessData } from '@/types/business'

interface EditButtonProps {
  business: Business
  onEditSuccess: (updatedBusiness: Business) => void
}

export function EditButton({ business, onEditSuccess }: EditButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [organizations, setOrganizations] = useState<
    { key: string; value: string; label: string }[]
  >([])
  const [selectedOrganization, setSelectedOrganization] = useState<
    string | null
  >(business.organizations?.[0] || null)

  useEffect(() => {
    const fetchOrganizations = async () => {
      const orgs = await getOrganizations()
      const formattedOrgs = orgs.map((org: Organizations) => ({
        key: org.id_organization,
        value: org.id_organization,
        label: org.name
      }))
      setOrganizations(formattedOrgs)
    }
    fetchOrganizations()
  }, [])

  const handleOpenDialog = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDialogOpen(true)
  }
  const handleCloseDialog = () => setIsDialogOpen(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formElement = event.currentTarget
    const formData = new FormData(formElement)

    const businessData: CreateBusinessData = {
      name: formData.get('name')?.toString() || '',
      owner_id: formData.get('owner_id')?.toString() || '',
      logo_url: '',
      organization: selectedOrganization || ''
    }

    try {
      const updatedBusiness = await updateBusiness(
        business.id_business,
        businessData
      )
      onEditSuccess(updatedBusiness)
      handleCloseDialog()
    } catch (error) {
      console.error('Error updating business:', error)
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
              Editar emprendimiento
            </DialogTitle>
            <DialogDescription>
              Modifica la información del emprendimiento
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                placeholder="Nombre del emprendimiento"
                defaultValue={business.name}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="owner_id">Dueño</Label>
              <Input
                id="owner_id"
                name="owner_id"
                placeholder="ID del dueño"
                defaultValue={business.owner_id}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="organization">Organización</Label>
              <Combobox
                items={organizations}
                placeholder="Selecciona la organización"
                emptyMessage="No se encontraron organizaciones."
                onChange={(value: string | null) =>
                  setSelectedOrganization(value)
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="picture">Logo</Label>
              <Input id="picture" name="picture" type="file" accept="image/*" />
            </div>
            <Button type="submit" className="w-full">
              Guardar cambios
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}