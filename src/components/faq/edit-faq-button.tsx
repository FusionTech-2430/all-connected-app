'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import type { FAQ } from '@/types/faq'

interface EditFAQButtonProps {
  faq: FAQ
  onEditSuccess: (updatedFAQ: FAQ) => void
}

export function EditFAQButton({ faq, onEditSuccess }: EditFAQButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOpenDialog = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDialogOpen(true)
  }
  const handleCloseDialog = () => setIsDialogOpen(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const updatedFAQData = {
      category: formData.get('category') as string,
      question: formData.get('question') as string,
      answer: formData.get('answer') as string
    }

    try {
      // Simulate API call
      const updatedFAQ: FAQ = {
        ...faq,
        ...updatedFAQData
      }
      onEditSuccess(updatedFAQ)
      handleCloseDialog()
    } catch (error) {
      console.error('Error updating FAQ:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <DropdownMenuItem
        className="flex items-center cursor-pointer"
        onClick={handleOpenDialog}
      >
        <Pencil className="mr-2 h-4 w-4 text-yellow-500" />
        Modificar
      </DropdownMenuItem>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar pregunta frecuente</DialogTitle>
            <DialogDescription>
              Modifica la información de la pregunta frecuente
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Input
                id="category"
                name="category"
                defaultValue={faq.category}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="question">Pregunta</Label>
              <Input
                id="question"
                name="question"
                defaultValue={faq.question}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer">Respuesta</Label>
              <Textarea
                id="answer"
                name="answer"
                defaultValue={faq.answer}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
