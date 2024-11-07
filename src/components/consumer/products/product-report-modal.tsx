'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { AlertTriangle } from 'lucide-react'
import { createProductReport } from '@/lib/api/products'

interface ProductReportModalProps {
  productId: number
  isOpen: boolean
  onClose: () => void
}

export default function Component({ productId, isOpen, onClose }: ProductReportModalProps = { productId: 1, isOpen: false, onClose: () => {} }) {
  const [category, setCategory] = useState('')
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!category || !reason || !description) {
      toast({
        title: 'Error',
        description: 'Por favor complete todos los campos',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      await createProductReport(productId, {
        category,
        productId,
        reason,
        description,
        reportDate: new Date(),
      })

      toast({
        title: 'Éxito',
        description: 'El reporte se ha enviado correctamente',
        className: 'bg-green-500 text-white',
      })

      onClose()
      setCategory('')
      setReason('')
      setDescription('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo enviar el reporte. Por favor intente nuevamente.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Reportar Producto
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Seleccione una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inappropriate">Contenido inapropiado</SelectItem>
                <SelectItem value="fake">Producto falso</SelectItem>
                <SelectItem value="scam">Posible estafa</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reason">Razón</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Seleccione una razón" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="misleading">Información engañosa</SelectItem>
                <SelectItem value="offensive">Contenido ofensivo</SelectItem>
                <SelectItem value="illegal">Producto ilegal</SelectItem>
                <SelectItem value="quality">Problemas de calidad</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Describa el problema en detalle"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-32"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}