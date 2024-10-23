import React, { useState } from 'react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
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
import { User } from '@/types/users/user'
import { deleteUser } from '@/lib/api/users'

interface DeleteUserButtonProps {
  user: User
  onUserDeleted: (userId: string) => void
}

export function DeleteUserButton({
  user,
  onUserDeleted
}: DeleteUserButtonProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDelete = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteUser = async () => {
    try {
      await deleteUser(user.id_user)
      onUserDeleted(user.id_user)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error('Failed to delete user:', error)
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
              ¿Estás seguro de que quieres eliminar este usuario?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              el usuario y todos sus datos asociados de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
