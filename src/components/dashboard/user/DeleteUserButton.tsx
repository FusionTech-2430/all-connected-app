'use client'

import React, { useState } from 'react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Trash2 } from 'lucide-react'
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

export function DeleteUserButton({
  user,
  onUserDeleted
}: DeleteUserButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleDeleteUser = async () => {
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
        description:
          'No se pudo eliminar el usuario. Por favor, intente nuevamente.',
        variant: 'destructive'
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <DropdownMenuItem
        onSelect={(event) => {
          event.preventDefault()
          setIsDialogOpen(true)
        }}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Eliminar
      </DropdownMenuItem>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            ¿Está seguro de que desea eliminar al usuario {user.fullname}? Esta
            acción no se puede deshacer.
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
              onClick={handleDeleteUser}
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar Usuario'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
