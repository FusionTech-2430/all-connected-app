'use client'

import React, { useState } from 'react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { AlertTriangle, Trash } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { User } from '@/types/users/user'
import { deleteUser } from '@/lib/api/users'
import { useToast } from '@/components/ui/use-toast'

interface DeleteUserButtonProps {
  user: User
  onUserDeleted: (userId: string) => void
}

export default function DeleteUserButton({
  user,
  onUserDeleted
}: DeleteUserButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDeleteClick = (event: Event) => {
    event.preventDefault()
    setIsDialogOpen(true)
  }

  const deleteUserAccount = async () => {
    setIsDeleting(true)

    try {
      await deleteUser(user.id_user)
      onUserDeleted(user.id_user)
      setIsDialogOpen(false)
      toast({
        title: 'Usuario eliminado',
        description: `El usuario ${user.fullname} ha sido eliminado exitosamente.`
      })
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el usuario. Por favor, intente nuevamente.',
        variant: 'destructive'
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <DropdownMenuItem onSelect={handleDeleteClick}>
        <Trash className="mr-2 h-4 w-4 text-red-500" />
        Eliminar
      </DropdownMenuItem>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Advertencia: Eliminar Usuario
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Está a punto de eliminar al usuario {user.fullname}. Esta acción no se puede deshacer.
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={deleteUserAccount}
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'} Usuario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}