import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Organizations } from '@/types/organizations'
import { deleteOrganization } from '@/lib/api/organizations'

interface DeleteOrganizationButtonProps {
  organization: Organizations
  onDeleteSuccess: (organizationId: string) => void
}

export function DeleteOrganizationButton({
  organization,
  onDeleteSuccess
}: DeleteOrganizationButtonProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDelete = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteOrganization = async () => {
    try {
      await deleteOrganization(organization.id_organization)
      onDeleteSuccess(organization.id_organization)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error('Failed to delete organization:', error)
    }
  }

  return (
    <>
      <DropdownMenuItem className="flex items-center cursor-pointer" onClick={handleDelete}>
        <Trash2 className="mr-2 h-4 w-4 text-red-500" />
        Eliminar
      </DropdownMenuItem>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de que quieres eliminar esta organización?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la organización y eliminará los datos de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteOrganization}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}