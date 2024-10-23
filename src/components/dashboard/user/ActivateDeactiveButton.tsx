'use client'

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
import { Input } from '@/components/ui/input'
import { User } from '@/types/users/user'
import { deactivateUser } from '@/lib/api/users'
import { useToast } from '@/components/ui/use-toast'

interface ActivateDeactivateButtonProps {
  user: User
  onUserUpdated: (updatedUser: User) => void
}

export default function ActivateDeactivateButton({
  user,
  onUserUpdated
}: ActivateDeactivateButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [reason, setReason] = useState('')
  const { toast } = useToast()

  const handleStatusChange = (event: Event) => {
    event.preventDefault()
    setIsDialogOpen(true)
  }

  const updateUserStatus = async () => {
    if (!user.active && !reason.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor, ingrese una razón para desactivar el usuario.',
        variant: 'destructive'
      })
      return
    }

    setIsUpdating(true)

    try {
      let updatedUser: User | null = null
      if (user.active) {
        updatedUser = await deactivateUser(user.id_user, reason)
      } 
      // else {
      //   updatedUser = await activateUser(user.id_user)
      // }
      if (updatedUser) {
        onUserUpdated(updatedUser)
      }
      setIsDialogOpen(false)
      toast({
        title: 'Estado de usuario actualizado',
        description: `El usuario ${user.fullname} ha sido ${user.active ? 'bloqueado' : 'activado'} exitosamente.`
      })
    } catch (error) {
      console.error('Error updating user status:', error)
      toast({
        title: 'Error',
        description: `No se pudo ${user.active ? 'desactivar' : 'activar'} el usuario. Por favor, intente nuevamente.`,
        variant: 'destructive'
      })
    } finally {
      setIsUpdating(false)
      setReason('')
    }
  }

  return (
    <>
      <DropdownMenuItem onSelect={handleStatusChange}>
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
              Advertencia: {user.active ? 'Desactivar' : 'Activar'} Usuario
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Está a punto de {user.active ? 'desactivar' : 'activar'} al usuario{' '}
            {user.fullname}. Esta acción afectará el acceso del usuario a la
            plataforma.
            {user.active &&
              'Por favor, ingrese una razón para la desactivación.'}
          </DialogDescription>
          {user.active && (
            <Input
              placeholder="Razón para desactivar"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isUpdating}
            >
              Cancelar
            </Button>
            <Button
              variant={user.active ? 'destructive' : 'default'}
              onClick={updateUserStatus}
              disabled={isUpdating}
            >
              {isUpdating
                ? user.active
                  ? 'Desactivando...'
                  : 'Activando...'
                : user.active
                  ? 'Desactivar'
                  : 'Activar'}{' '}
              Usuario
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
