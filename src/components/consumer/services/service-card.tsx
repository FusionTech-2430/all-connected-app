import Image from 'next/image'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ServiceCardProps {
  service: {
    id: number
    name: string
    description: string
    photoUrl: string | null
  }
  onViewService: (id: number) => void
}

export function ServiceCard({ service, onViewService }: ServiceCardProps) {
  return (
    <div className="border rounded-lg shadow-sm p-4 flex flex-col items-center">
      <Dialog>
        <DialogTrigger asChild>
          <div className="w-full h-40 mb-3 cursor-pointer overflow-hidden rounded-lg">
            {service.photoUrl ? (
              <Image
                src={service.photoUrl}
                alt={service.name}
                width={200}
                height={200}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                No image
              </div>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          {service.photoUrl && (
            <Image
              src={service.photoUrl}
              alt={service.name}
              width={800}
              height={600}
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
      <h4 className="font-semibold text-center text-sm">{service.name}</h4>
      <p className="text-xs text-gray-600 mb-2 text-center line-clamp-2">{service.description}</p>
      <Button className="w-full text-sm" onClick={() => onViewService(service.id)}>Ver Servicio</Button>
    </div>
  )
}
