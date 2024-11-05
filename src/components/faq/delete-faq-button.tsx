'use client'

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
import { FAQ } from '@/types/faq'
import { deleteFaq } from '@/lib/api/faq'

interface DeleteFAQButtonProps {
  faq: FAQ
  onDeleteSuccess: (faqId: number) => void
}

export function DeleteFAQButton({
  faq,
  onDeleteSuccess
}: DeleteFAQButtonProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDelete = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteFAQ = async () => {
    try {
      await deleteFaq(faq.id)
      onDeleteSuccess(faq.id)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error('Failed to delete FAQ:', error)
    }
  }

  return (
    <>
      <DropdownMenuItem
        className="flex items-center cursor-pointer"
        onClick={handleDelete}
      >
        <Trash2 className="mr-2 h-4 w-4 text-red-500" />
        Eliminar
      </DropdownMenuItem>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Estás seguro de que quieres eliminar esta pregunta frecuente?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              la pregunta frecuente de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFAQ}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
