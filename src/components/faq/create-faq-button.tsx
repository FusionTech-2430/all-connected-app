'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { FAQ } from '@/types/faq'
import { toast } from 'sonner'
import { createFaq } from '@/lib/api/faq'

interface CreateFAQButtonProps {
  onFAQCreated: (newFAQ: FAQ) => void
}

export function CreateFAQButton({ onFAQCreated }: CreateFAQButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpenDialog = () => setIsDialogOpen(true)
  const handleCloseDialog = () => setIsDialogOpen(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
       // Example in CreateFAQButton.tsx
    const faqData = {
      pregunta: formData.get('question') as string,
      respuesta: formData.get('answer') as string
    }

    try {
      const newFAQ = await createFaq(faqData)
      onFAQCreated(newFAQ)
      toast.success('Pregunta frecuente creada exitosamente')
      handleCloseDialog()
    } catch (error) {
      console.error('Error creating FAQ:', error)
      toast.error('Error al crear la pregunta frecuente')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button onClick={handleOpenDialog}>Añadir FAQ</Button>
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Añadir nueva pregunta frecuente</DialogTitle>
            <DialogDescription>
              Llena el formulario con la información de la nueva pregunta
              frecuente
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="question">Pregunta</Label>
              <Input
                id="question"
                name="question"
                placeholder="Ingresa la pregunta"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer">Respuesta</Label>
                            <Textarea
                id="answer"
                name="answer"
                placeholder="Ingresa la respuesta"
                required
                rows={6} // Increased number of rows
                className="h-32" // Alternatively, set a fixed height
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear FAQ'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
