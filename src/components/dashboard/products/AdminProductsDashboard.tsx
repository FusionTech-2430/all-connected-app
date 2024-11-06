'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { MoreHorizontal, Search, Eye, Package, Trash2 } from 'lucide-react'
import { ProductsReport, Products } from '@/types/products'
import {
  getReports,
  getReportById,
  getProductById,
  deleteProductReport,
  updateProduct
} from '@/lib/api/products'
import { getBusiness } from '@/lib/api/business'
import SearchInput from '@/components/shared/search-input'

interface ServiceReport {
  id: number
  id_service: number
  reason: string
  description: string
  report_date: string
}

interface Service {
  id: number
  id_service: number
  id_business: string
  name: string
  description: string
  labels: string[]
  photo_url: string
  state: string
}

type Item = ProductsReport | ServiceReport

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export default function AdminProductsDashboard() {
  const [reports, setReports] = useState<ProductsReport[]>([])
  const [serviceReports, setServiceReports] = useState<ServiceReport[]>([])
  const [selectedReport, setSelectedReport] = useState<ProductsReport | null>(
    null
  )
  const [selectedProduct, setSelectedProduct] = useState<Products | null>(null)
  const [selectedServiceReport, setSelectedServiceReport] =
    useState<ServiceReport | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isViewReportDialogOpen, setIsViewReportDialogOpen] = useState(false)
  const [isViewProductDialogOpen, setIsViewProductDialogOpen] = useState(false)
  const [isViewServiceReportDialogOpen, setIsViewServiceReportDialogOpen] =
    useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<
    'todos' | 'productos' | 'servicios'
  >('todos')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [productNames, setProductNames] = useState<Record<number, string>>({})
  const [productImages, setProductImages] = useState<Record<number, string>>({})
  const [serviceNames, setServiceNames] = useState<Record<number, string>>({})
  const [serviceImages, setServiceImages] = useState<Record<number, string>>({})
  const [businessNames, setBusinessNames] = useState<Record<string, string>>({})
  const itemsPerPage = 10

  useEffect(() => {
    fetchReports()
    fetchServiceReports()
  }, [])

  const fetchBusinessNames = async (products: Products[]) => {
    const names: Record<string, string> = {}
    for (const product of products) {
      if (!names[product.idBusiness]) {
        try {
          const business = await getBusiness(product.idBusiness)
          names[product.idBusiness] = business.name
        } catch (error) {
          console.error(
            `Failed to fetch business name for ID ${product.idBusiness}:`,
            error
          )
          names[product.idBusiness] = 'Unknown Business'
        }
      }
    }
    setBusinessNames(names)
  }

  const fetchReports = async () => {
    try {
      const fetchedReports = await getReports()
      setReports(fetchedReports)

      const names: Record<number, string> = {}
      const images: Record<number, string> = {}
      const products: Products[] = []

      for (const report of fetchedReports) {
        const product = await getProductById(report.productId)
        names[report.productId] = product.name
        images[report.productId] = product.photoUrl || '/placeholder.svg'
        products.push(product)
      }
      setProductNames(names)
      setProductImages(images)
      fetchBusinessNames(products)
    } catch (error) {
      console.error('Failed to fetch reports:', error)
    }
  }

  const fetchServiceReports = async () => {
    try {
      const response = await fetch(
        'https://mockserverservices-production.up.railway.app/api/v1/reports'
      )
      const fetchedReports = await response.json()
      setServiceReports(fetchedReports)

      const names: Record<number, string> = {}
      const images: Record<number, string> = {}

      for (const report of fetchedReports) {
        const service = await fetchService(report.id_service)
        names[report.id_service] = service.name
        images[report.id_service] = service.photo_url
      }
      setServiceNames(names)
      setServiceImages(images)
    } catch (error) {
      console.error('Failed to fetch service reports:', error)
    }
  }

  const fetchService = async (id: number): Promise<Service> => {
    const response = await fetch(
      `https://mockserverservices-production.up.railway.app/api/v1/services/${id}`
    )
    return await response.json()
  }

  const handleViewReport = async (report: ProductsReport) => {
    try {
      const fullReport = await getReportById(report.productId)
      setSelectedReport(fullReport)
      const product = await getProductById(report.productId)
      setSelectedProduct(product)
      setIsViewReportDialogOpen(true)
    } catch (error) {
      console.error('Failed to fetch report details:', error)
    }
  }

  const handleViewProduct = async (productId: number) => {
    try {
      const product = await getProductById(productId)
      setSelectedProduct(product)
      setIsViewProductDialogOpen(true)
    } catch (error) {
      console.error('Failed to fetch product details:', error)
    }
  }

  const handleViewServiceReport = async (report: ServiceReport) => {
    setSelectedServiceReport(report)
    const service = await fetchService(report.id_service)
    setSelectedService(service)
    setIsViewServiceReportDialogOpen(true)
  }

  const handleDeleteReport = async (reportId: number) => {
    try {
      await deleteProductReport(reportId)
      setReports((prevReports) =>
        prevReports.filter((report) => report.productId !== reportId)
      )
      setIsViewReportDialogOpen(false)
    } catch (error) {
      console.error('Failed to delete report:', error)
    }
  }

  const handleDeleteServiceReport = async (reportId: number) => {
    try {
      await fetch(
        `https://mockserverservices-production.up.railway.app/api/v1/reports/${reportId}`,
        {
          method: 'DELETE'
        }
      )
      setServiceReports((prevReports) =>
        prevReports.filter((report) => report.id !== reportId)
      )
      setIsViewServiceReportDialogOpen(false)
    } catch (error) {
      console.error('Failed to delete service report:', error)
    }
  }

  const handleAcceptReport = async () => {
    if (selectedReport && selectedProduct) {
      try {
        const updatedProduct = {
          ...selectedProduct,
          status: 'inactive'
        }
        await updateProduct(selectedProduct.id, updatedProduct)
        await deleteProductReport(selectedReport.productId)
        setReports((prevReports) =>
          prevReports.filter(
            (report) => report.productId !== selectedReport.productId
          )
        )
        setIsViewReportDialogOpen(false)
        setIsConfirmDialogOpen(false)
        // Optionally, you can show a success message here
      } catch (error) {
        console.error('Failed to accept report:', error)
        // Optionally, you can show an error message here
      }
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const translateStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'Activo'
      case 'inactive':
        return 'Inactivo'
      default:
        return status
    }
  }

  const filteredItems: Item[] = (() => {
    let items: Item[] = []

    if (selectedCategory === 'todos' || selectedCategory === 'productos') {
      const filteredReports = reports.filter(
        (report) =>
          report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          productNames[report.productId]
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
      items = items.concat(filteredReports)
    }

    if (selectedCategory === 'todos' || selectedCategory === 'servicios') {
      const filteredServiceReports = serviceReports.filter(
        (report) =>
          report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          serviceNames[report.id_service]
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
      items = items.concat(filteredServiceReports)
    }

    return items
  })()

  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Gestión de reportes de productos y servicios
        </h2>
        <div className="mb-4 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <SearchInput
            className="pl-8 w-full"
            paramName="search"
            placeholder="Buscar por nombre, motivo o descripción..."
            onChange={setSearchTerm}
            value={searchTerm}
          />
        </div>
        <div className="mb-4 flex space-x-2">
          <Button
            variant={selectedCategory === 'todos' ? 'default' : 'outline'}
            onClick={() => {
              setSelectedCategory('todos')
              setCurrentPage(1)
            }}
          >
            Todos
          </Button>
          <Button
            variant={selectedCategory === 'productos' ? 'default' : 'outline'}
            onClick={() => {
              setSelectedCategory('productos')
              setCurrentPage(1)
            }}
          >
            Productos
          </Button>
          <Button
            variant={selectedCategory === 'servicios' ? 'default' : 'outline'}
            onClick={() => {
              setSelectedCategory('servicios')
              setCurrentPage(1)
            }}
          >
            Servicios
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto/Servicio</TableHead>
              <TableHead>Motivo</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Fecha del Reporte</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((item, index) => {
              const isServiceReport = 'id_service' in item
              return (
                <TableRow
                  key={
                    isServiceReport
                      ? `service-${item.id}`
                      : `product-${(item as ProductsReport).productId}-${index}`
                  }
                >
                  <TableCell>
                    <div className="flex items-center">
                      <Image
                        src={
                          isServiceReport
                            ? 
                              '/placeholder.svg'
                            : productImages[
                                (item as ProductsReport).productId
                              ] || '/placeholder.svg'
                        }
                        alt={
                          isServiceReport
                            ? serviceNames[item.id_service] || 'Servicio'
                            : productNames[
                                (item as ProductsReport).productId
                              ] || 'Producto'
                        }
                        width={48}
                        height={48}
                        className="rounded-md mr-2"
                      />
                      <span>
                        {isServiceReport
                          ? serviceNames[item.id_service] || 'Cargando...'
                          : productNames[(item as ProductsReport).productId] ||
                            'Cargando...'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell title={item.reason}>
                    {truncateText(item.reason, 30)}
                  </TableCell>
                  <TableCell title={item.description}>
                    {truncateText(item.description, 30)}
                  </TableCell>
                  <TableCell>
                    {isServiceReport
                      ? formatDate(item.report_date)
                      : formatDate((item as ProductsReport).reportDate)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() =>
                            isServiceReport
                              ? handleViewServiceReport(item as ServiceReport)
                              : handleViewReport(item as ProductsReport)
                          }
                        >
                          <Eye className="mr-2 h-4 w-4 text-blue-500" />
                          Visualizar Reporte
                        </DropdownMenuItem>
                        {!isServiceReport && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleViewProduct(
                                (item as ProductsReport).productId
                              )
                            }
                          >
                            <Package className="mr-2 h-4 w-4 text-green-500" />
                            Ver Producto
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() =>
                            isServiceReport
                              ? handleDeleteServiceReport(
                                  (item as ServiceReport).id
                                )
                              : handleDeleteReport(
                                  (item as ProductsReport).productId
                                )
                          }
                        >
                          <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                          Eliminar Reporte
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} -{' '}
            {Math.min(currentPage * itemsPerPage, filteredItems.length)} de{' '}
            {filteredItems.length} reportes.
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              &lt;&lt;
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </Button>
            <span className="text-sm py-2">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              &gt;
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              &gt;&gt;
            </Button>
          </div>
        </div>
      </div>

      {/* Dialog for viewing product reports */}
      <Dialog
        open={isViewReportDialogOpen}
        onOpenChange={setIsViewReportDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Visualizar reporte de producto</DialogTitle>
          </DialogHeader>
          {selectedReport && selectedProduct && (
            <div className="grid gap-4 py-4">
              <div className="w-full h-40 relative mb-4">
                <Image
                  src={selectedProduct.photoUrl || '/placeholder.svg'}
                  alt={selectedProduct.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productName" className="text-right">
                  Producto
                </Label>
                <Input
                  id="productName"
                  value={selectedProduct.name}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">
                  Motivo
                </Label>
                <Input
                  id="reason"
                  value={selectedReport.reason}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  value={selectedReport.description}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reportDate" className="text-right">
                  Fecha del Reporte
                </Label>
                <Input
                  id="reportDate"
                  value={formatDate(selectedReport.reportDate)}
                  readOnly
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewReportDialogOpen(false)}>
              Cerrar
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedReport && handleDeleteReport(selectedReport.productId)
              }
            >
              Eliminar Reporte
            </Button>
            <Button
              variant="default"
              onClick={() => setIsConfirmDialogOpen(true)}
            >
              Aceptar Reporte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar acción</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de aceptar el reporte? Si lo aceptas, el estado del
              producto pasará a estar inactivo.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsConfirmDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="default" onClick={handleAcceptReport}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for viewing products */}
      <Dialog
        open={isViewProductDialogOpen}
        onOpenChange={setIsViewProductDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Información del Producto</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid gap-4 py-4">
              <div className="w-full h-40 relative mb-4">
                <Image
                  src={selectedProduct.photoUrl || '/placeholder.svg'}
                  alt={selectedProduct.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productName" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="productName"
                  value={selectedProduct.name}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productDescription" className="text-right">
                  Descripción
                </Label>
                <Textarea
                  id="productDescription"
                  value={selectedProduct.description}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productStock" className="text-right">
                  Stock
                </Label>
                <Input
                  id="productStock"
                  value={selectedProduct.stock}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productPrice" className="text-right">
                  Precio
                </Label>
                <Input
                  id="productPrice"
                  value={`$${selectedProduct.price.toFixed(2)}`}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productStatus" className="text-right">
                  Estado
                </Label>
                <Input
                  id="productStatus"
                  value={translateStatus(selectedProduct.status)}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productLabels" className="text-right">
                  Etiqueta
                </Label>
                <Input
                  id="productLabels"
                  value={selectedProduct.labels.join(', ')}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productBusiness" className="text-right">
                  Negocio
                </Label>
                <Input
                  id="productBusiness"
                  value={
                    businessNames[selectedProduct.idBusiness] || 'Cargando...'
                  }
                  readOnly
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewProductDialogOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for viewing service reports */}
      <Dialog
        open={isViewServiceReportDialogOpen}
        onOpenChange={setIsViewServiceReportDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Visualizar reporte de servicio</DialogTitle>
          </DialogHeader>
          {selectedServiceReport && selectedService && (
            <div className="grid gap-4 py-4">
              <div className="w-full h-40 relative mb-4">
                <Image
                  src={'/placeholder.svg'}
                  alt={selectedService.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="serviceName" className="text-right">
                  Servicio
                </Label>
                <Input
                  id="serviceName"
                  value={selectedService.name}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="serviceReason" className="text-right">
                  Motivo
                </Label>
                <Input
                  id="serviceReason"
                  value={selectedServiceReport.reason}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="serviceDescription" className="text-right">
                  Descripción
                </Label>
                <Textarea
                  id="serviceDescription"
                  value={selectedServiceReport.description}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="serviceReportDate" className="text-right">
                  Fecha del Reporte
                </Label>
                <Input
                  id="serviceReportDate"
                  value={formatDate(selectedServiceReport.report_date)}
                  readOnly
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewServiceReportDialogOpen(false)}>
              Cerrar
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                selectedServiceReport &&
                handleDeleteServiceReport(selectedServiceReport.id)
              }
            >
              Eliminar Reporte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
