'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import {
  AlertTriangle,
  Loader2,
  MessageCircle,
  Tag
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/use-toast'
import { useUserId } from '@/hooks/use-user-id'
import { getServiceById, createServiceReport } from '@/lib/api/services'
import { createChat } from '@/services/chatService'

interface Service {
  id: number
  id_business: string
  name: string
  description: string
  photoUrl: string
  state: string
  labels: string[]
}

interface Business {
  name: string
}

interface ServiceReportDTO {
  category: string
  id_service: number
  reason: string
  description: string
  report_date: Date
}

export default function ServicePage() {
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('id')

  const [service, setService] = useState<Service | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [reportData, setReportData] = useState<ServiceReportDTO>({
    category: '',
    id_service: 0,
    reason: '',
    description: '',
    report_date: new Date() // Cambiamos a snake_case aquí
  })
  const [reportErrorMessage, setReportErrorMessage] = useState('')

  const userId = useUserId()

  useEffect(() => {
    if (serviceId && !isNaN(parseInt(serviceId))) {
      fetchService(parseInt(serviceId))
    } else {
      toast({
        title: "Error",
        description: "ID de servicio no válido",
        variant: "destructive",
      })
    }
  }, [serviceId])

  const fetchService = async (id: number) => {
    setIsLoading(true)
    try {
      const serviceData = await getServiceById(id)

      if (!serviceData) {
        throw new Error("Servicio no encontrado")
      }

      const businessData: Business = { name: serviceData.id_business } 

      if (!businessData) {
        throw new Error("Información del negocio no encontrada")
      }

      setService(serviceData)
      setBusiness(businessData)
      getStatusDisplay(serviceData.state)
    } catch (error) {
      console.error("Error fetching service:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo cargar el servicio",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateReport = async () => {
    setReportErrorMessage('');

    if (!service) {
      setReportErrorMessage('Servicio no disponible');
      return;
    }

    if (!reportData.category) {
      setReportErrorMessage('Por favor seleccione una categoría');
      return;
    }

    if (!reportData.reason) {
      setReportErrorMessage('Por favor seleccione una razón');
      return;
    }

    if (!reportData.description.trim()) {
      setReportErrorMessage('Por favor ingrese una descripción');
      return;
    }

    try {
      // Llamada al API con la estructura correcta
      await createServiceReport(service.id, {
        id_service: service.id,
        category: reportData.category,
        reason: reportData.reason,
        description: reportData.description,
        report_date: new Date(), // Asegúrate de usar `report_date` aquí también
      });

      setReportErrorMessage('');
      setIsReportModalOpen(false);
      setReportData({
        category: '',
        id_service: 0,
        reason: '',
        description: '',
        report_date: new Date(),
      });
      toast({
        title: 'Éxito',
        description: 'Reporte enviado correctamente',
        className: 'bg-[#0EA5E9] text-white',
      });
    } catch (error: unknown) {
      console.error("Error al crear el reporte:", error);

      if (error instanceof Error && error.message.includes("duplicate key")) {
        setReportErrorMessage("El servicio ya se encuentra reportado, el equipo de AllConnected está evaluando el caso.");
      } else {
        setReportErrorMessage("No se pudo enviar el reporte. Por favor intente nuevamente.");
      }
    }
  };

  const handleChat = () => {
    if (!userId || !service) {
      toast({
        title: 'Error',
        description: 'Usuario o servicio no disponible',
        variant: 'destructive',
      });
      return;
    }
    const chatId = createChat("Consulta servicio "+service?.name, userId, service.id_business)
    console.log(chatId)
    window.location.href = '/consumer/messages/chat?id=' + chatId
  }

  const getStatusDisplay = (status: string) => {
    if (!status) {
      return <span className="text-gray-600">Estado desconocido</span>;
    }

    switch (status.toLowerCase()) {
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <span className="w-2 h-2 mr-2 bg-green-400 rounded-full"></span>
          Activo
        </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <span className="w-2 h-2 mr-2 bg-red-400 rounded-full"></span>
          En Pausa
        </span>
        );
      default:
        return <span className="text-gray-600">{status}</span>;
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!service || !business) return <div>Servicio no encontrado</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="relative w-full bg-gradient-to-br from-[#0C4A6E] via-[#075985] to-[#0369A1] overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ij48Y2lyY2xlIGN4PSIxIiBjeT0iMSIgcj0iMSIvPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-white tracking-tight drop-shadow-lg">
            Información del Servicio
          </h1>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-8 text-gray-50"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-current"
            />
          </svg>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 shadow-inner">
                <Image
                  src={service.photoUrl}
                  alt={service.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://lh5.googleusercontent.com/proxy/UoMqdNMcsLqSB9IQZCFizi9KwOEKzk_UfD7qszDTq0fRv6VGJuuC90AAgQAaCANT8e54wV6aAoPC_M37zpVmgrpcJ7g7RhU0dweCcuZDEyFB8ufMwkhjOMbdGOg";
                  }}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-gray-500 text-sm font-medium"> <b>Emprendimiento:</b> {business.name}</p>
                <h2 className="text-3xl font-bold text-gray-900 mt-1">
                  {service.name}
                </h2>
              </div>

              <p className="text-gray-700 text-lg">{service.description}</p>

              <div className="border-t border-b border-gray-200 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-xl font-semibold text-gray-900">Estado:</p>
                  {getStatusDisplay(service.state)}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Tag className="mr-2" /> Etiquetas:
                </h3>
                <div className="flex flex-wrap gap-3">
                  {service.labels.map((label, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium shadow-sm border border-blue-100 hover:bg-blue-100 transition-colors"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  className="w-full py-6 text-lg bg-[#0EA5E9] hover:bg-[#0284C7] text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                  onClick={handleChat}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contactar al Proveedor
                </Button>

                <button
                  className="w-full text-sm text-gray-500 flex items-center justify-center hover:text-gray-700 transition-colors duration-300"
                  onClick={() => setIsReportModalOpen(true)}
                >
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Reportar servicio o emprendimiento
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Reportar Servicio
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {reportErrorMessage && (
              <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{reportErrorMessage}</p>
            )}
            <div className="grid gap-2">
              <Label htmlFor="category" className="text-sm font-medium">Categoría</Label>
              <Select
                value={reportData.category}
                onValueChange={(value) => setReportData({ ...reportData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Seleccione una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inappropriate">Contenido inapropiado</SelectItem>
                  <SelectItem value="fake">Servicio falso</SelectItem>
                  <SelectItem value="scam">Posible estafa</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason" className="text-sm font-medium">Razón</Label>
              <Select
                value={reportData.reason}
                onValueChange={(value) => setReportData({ ...reportData, reason: value })}
              >
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Seleccione una razón" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="misleading">Información engañosa</SelectItem>
                  <SelectItem value="offensive">Contenido ofensivo</SelectItem>
                  <SelectItem value="illegal">Servicio ilegal</SelectItem>
                  <SelectItem value="quality">Problemas de calidad</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-sm font-medium">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describa el problema en detalle"
                value={reportData.description}
                onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                className="h-32 resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReportModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateReport} className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white">
              Enviar Reporte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}