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
import { getUsers } from '@/lib/api/users'
import { updateBusiness } from '@/lib/api/business'
import { Organizations } from '@/types/organizations'
import { User } from '@/types/users/user'
import type { Business, CreateBusinessData } from '@/types/business'

interface EditButtonProps {
  business: Business
  onEditSuccess: (updatedBusiness: Business) => void
}

export function EditButton({ business, onEditSuccess }: EditButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [organizations, setOrganizations] = useState<
    { key: string; value: string; label: string }[]
  >([])
  const [users, setUsers] = useState<
    { key: string; value: string; label: string }[]
  >([])
  const [selectedOrganization, setSelectedOrganization] = useState<
    string | null
  >(business.organizations?.[0] || null)
  const [selectedOwner, setSelectedOwner] = useState<string | null>(
    business.owner_id || null
  )
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const orgs = await getOrganizations()
      const formattedOrgs = orgs.map((org: Organizations) => ({
        key: org.id_organization,
        value: org.id_organization,
        label: org.name
      }))
      setOrganizations(formattedOrgs)

      const usersData = await getUsers()
      const formattedUsers = usersData.map((user: User) => ({
        key: user.id_user,
        value: user.id_user,
        label: user.fullname
      }))
      setUsers(formattedUsers)
    }
    fetchData()
  }, [])

  const handleOpenDialog = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDialogOpen(true)
  }
  const handleCloseDialog = () => setIsDialogOpen(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formElement = event.currentTarget
    const formData = new FormData(formElement)

    if (selectedImage) {
      formData.set('logo_url', selectedImage)
    }

    if (selectedOrganization) {
      formData.set('organization', selectedOrganization)
    }

    if (selectedOwner) {
      formData.set('owner_id', selectedOwner)
    }

    try {
      const updatedBusiness = await updateBusiness(
        business.id_business,
        formData
      )
      onEditSuccess(updatedBusiness)
      handleCloseDialog()
    } catch (error) {
      console.error('Error updating business:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0])
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
              <Combobox
                items={users}
                placeholder="Selecciona el dueño"
                emptyMessage="No se encontraron usuarios."
                onChange={(value: string | null) => setSelectedOwner(value)}
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
                defaultValue={business.organizations?.[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo_url">Logo</Label>
              <Input
                id="logo_url"
                name="logo_url"
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
