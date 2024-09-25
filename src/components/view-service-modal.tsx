'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import Image from 'next/image'

interface Service {
  name: string
  category: string
  requests: number
  description?: string
  tags?: string
  photo?: string
}

interface ViewServiceModalProps {
  service: Service | null
  isOpen: boolean
  onClose: () => void
}

export function ViewServiceModal({
  service,
  isOpen,
  onClose
}: ViewServiceModalProps) {
  if (!service) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalles del Servicio</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-bold">Nombre:</Label>
            <span className="col-span-3">{service.name}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-bold">Categoría:</Label>
            <span className="col-span-3">{service.category}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right font-bold">Solicitudes:</Label>
            <span className="col-span-3">{service.requests}</span>
          </div>
          {service.description && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">Descripción:</Label>
              <span className="col-span-3">{service.description}</span>
            </div>
          )}
          {service.tags && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">Etiquetas:</Label>
              <span className="col-span-3">{service.tags}</span>
            </div>
          )}
          {service.photo && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right font-bold">Foto:</Label>
              <Image
                src={service.photo}
                alt={service.name}
                width={100}
                height={100}
                className="col-span-3 max-w-full h-auto"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
