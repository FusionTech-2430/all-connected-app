import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

interface EventCardProps {
  event: {
    id: number
    nombre: string
    aforo: number
    fecha: Date
  }
  onViewEvent: (id: number) => void
}

export function EventCard({ event }: EventCardProps) {
  const formattedDate = new Date(event.fecha).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="border rounded-lg shadow-sm p-4 flex flex-col items-center">
      <Dialog>
        <DialogTrigger asChild>
          <div className="w-full h-40 mb-3 cursor-pointer overflow-hidden rounded-lg relative bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 font-semibold text-lg">No image</span>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-3xl">
          <div className="w-full h-auto rounded-lg bg-gray-200 flex items-center justify-center p-6">
            <span className="text-gray-500 font-semibold text-2xl">No image</span>
          </div>
        </DialogContent>
      </Dialog>
      <h4 className="font-semibold text-center text-sm">{event.nombre}</h4>
      <p className="text-xs text-gray-600 mb-2 text-center">Aforo: {event.aforo}</p>
      <p className="text-xs text-gray-600 mb-2 text-center">Fecha: {formattedDate}</p>
    </div>
  )
}
