import React, { useState } from 'react'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
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
import { updateUser } from '@/lib/api/users'

interface ActivateDeactivateButtonProps {
  user: User
  onUserUpdated: (updatedUser: User) => void
}

export function ActivateDeactivateButton({
  user,
  onUserUpdated
}: ActivateDeactivateButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleStatusChange = () => {
    setIsDialogOpen(true)
  }

  const updateUserStatus = async () => {
    const newStatus = !user.active
    const formData = new FormData()
    formData.append('active', newStatus.toString())

    try {
      const updatedUser = await updateUser(user.id_user, formData)
      onUserUpdated(updatedUser)
    } catch (error) {
      console.error('Error updating user status:', error)
    }

    setIsDialogOpen(false)
  }

  return (
    <>
      <DropdownMenuItem onClick={handleStatusChange}>
        {user.active ? (
          <>
            <XCircle className="mr-2 h-4 w-4" />
            Desactivar
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Activar
          </>
        )}
      </DropdownMenuItem>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Advertencia: Cambiar Estado de Usuario
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Está a punto de {user.active ? 'desactivar' : 'activar'} al usuario{' '}
            {user.fullname}. Esta acción afectará el acceso del usuario a la
            plataforma. ¿Está seguro de que desea continuar?
          </DialogDescription>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={updateUserStatus}>
              {user.active ? 'Desactivar' : 'Activar'} Usuario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}