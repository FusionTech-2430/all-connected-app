import { useState } from 'react'
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Business } from '@/types/business'
import { deleteBusiness } from '@/lib/api/business'

interface DeleteButtonProps {
  business: Business
  onDeleteSuccess: (businessId: string) => void
}

export function DeleteButton({ business, onDeleteSuccess }: DeleteButtonProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDelete = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteBusiness = async () => {
    try {
      await deleteBusiness(business.id_business)
      onDeleteSuccess(business.id_business)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error('Failed to delete business:', error)
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
            <AlertDialogTitle>¿Estás seguro de que quieres eliminar este empredimiento?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el empredimiento y eliminará los datos de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBusiness}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}