'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function TokenInput() {
  const [token, setToken] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (token.trim()) {
      setIsDialogOpen(true)
      // Here you would typically make an API call to use the token
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
        <Button type="submit" className="w-full">Usar Token</Button>
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