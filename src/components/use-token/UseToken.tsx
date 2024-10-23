'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useUserId } from '@/hooks/use-user-id'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export default function TokenInput() {
  const [token, setToken] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const userId = useUserId()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (token.trim()) {
      // Here you would typically make an API call to use the token

      try {
        const response = await fetch(
          `${API_URL}/businesses-service/api/v1/businesses/join`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ join_token: token, id_user: userId })
          }
        )
        if (!response.ok) {
          throw new Error('Failed to join business')
        }
        const data = await response.json()
        console.log('Successfully', data)
        setIsDialogOpen(true)
      } catch (err) {}
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Ingresar Token</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Ingrese su token"
          required
        />
        <Button type="submit" className="w-full">
          Usar Token
        </Button>
      </form>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregado exitosamente</DialogTitle>
          </DialogHeader>
          <p>Has sido agregado al emprendimiento con éxito.</p>
          <Button onClick={() => setIsDialogOpen(false)}>Cerrar</Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
