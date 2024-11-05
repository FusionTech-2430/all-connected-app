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
  DialogFooter
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
  deleteProduct
} from '@/lib/api/products'
import SearchInput from '@/components/shared/search-input'

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// Mock data for services
const mockServices = [
  {
    id: 1,
    name: 'Servicio de Limpieza',
    description: 'Limpieza profesional para hogares y oficinas',
    price: 50.0,
    photoUrl: '/placeholder.svg?height=48&width=48'
  },
  {
    id: 2,
    name: 'Servicio de Jardinería',
    description: 'Mantenimiento y diseño de jardines',
    price: 75.0,
    photoUrl: '/placeholder.svg?height=48&width=48'
  },
  {
    id: 3,
    name: 'Reparación de Electrodomésticos',
    description: 'Servicio técnico para electrodomésticos',
    price: 60.0,
    photoUrl: '/placeholder.svg?height=48&width=48'
  }
]

export default function AdminProductsDashboard() {
  const [reports, setReports] = useState<ProductsReport[]>([])
  const [selectedReport, setSelectedReport] = useState<ProductsReport | null>(
    null
  )
  const [selectedProduct, setSelectedProduct] = useState<Products | null>(null)
  const [selectedService, setSelectedService] = useState<
    (typeof mockServices)[0] | null
  >(null)
  const [isViewReportDialogOpen, setIsViewReportDialogOpen] = useState(false)
  const [isViewProductDialogOpen, setIsViewProductDialogOpen] = useState(false)
  const [isViewServiceDialogOpen, setIsViewServiceDialogOpen] = useState(false)
  const [isDeleteProductDialogOpen, setIsDeleteProductDialogOpen] =
    useState(false)
  const [selectedCategory, setSelectedCategory] = useState<
    'todos' | 'productos' | 'servicios'
  >('todos')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [productNames, setProductNames] = useState<Record<number, string>>({})
  const [productImages, setProductImages] = useState<Record<number, string>>({})
  const itemsPerPage = 10

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const fetchedReports = await getReports()
      setReports(fetchedReports)

      // Fetch product names and images
      const names: Record<number, string> = {}
      const images: Record<number, string> = {}

      for (const report of fetchedReports) {
        const product = await getProductById(report.productId)
        names[report.productId] = product.name
        images[report.productId] = product.photoUrl || '/placeholder.svg'
      }
      setProductNames(names)
      setProductImages(images)
    } catch (error) {
      console.error('Failed to fetch reports:', error)
    }
  }

  const handleViewReport = async (report: ProductsReport) => {
    try {
      const fullReport = await getReportById(report.productId)
      setSelectedReport(fullReport)
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

  const handleViewService = (service: (typeof mockServices)[0]) => {
    setSelectedService(service)
    setIsViewServiceDialogOpen(true)
  }

  const handleDeleteProduct = async () => {
    if (selectedProduct) {
      try {
        await deleteProduct(selectedProduct.id)
        setIsDeleteProductDialogOpen(false)
        setIsViewProductDialogOpen(false)
        fetchReports()
      } catch (error) {
        console.error('Failed to delete product:', error)
      }
    }
  }

  const filteredItems = (() => {
    let items: any[] = []

    if (selectedCategory === 'todos' || selectedCategory === 'productos') {
      items = items.concat(
        reports.filter(
          (report) =>
            report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            productNames[report.productId]
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase())
        )
      )
    }

    if (selectedCategory === 'todos' || selectedCategory === 'servicios') {
      items = items.concat(
        mockServices.filter(
          (service) =>
            service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
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
            onClick={() => setSelectedCategory('todos')}
          >
            Todos
          </Button>
          <Button
            variant={selectedCategory === 'productos' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('productos')}
          >
            Productos
          </Button>
          <Button
            variant={selectedCategory === 'servicios' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('servicios')}
          >
            Servicios
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto/Servicio</TableHead>
              <TableHead>Motivo/Descripción</TableHead>
              <TableHead>Fecha del Reporte/Precio</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedItems.map((item, index) => {
              const isService = 'price' in item
              return (
                <TableRow
                  key={
                    isService
                      ? `service-${item.id}`
                      : `product-${item.productId}-${index}`
                  }
                >
                  <TableCell>
                    <div className="flex items-center">
                      <Image
                        src={
                          isService
                            ? item.photoUrl
                            : productImages[item.productId] ||
                              '/placeholder.svg'
                        }
                        alt={
                          isService
                            ? item.name
                            : productNames[item.productId] || 'Producto'
                        }
                        width={48}
                        height={48}
                        className="rounded-md mr-2"
                      />
                      <span>
                        {isService
                          ? item.name
                          : productNames[item.productId] || 'Cargando...'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell title={isService ? item.description : item.reason}>
                    {truncateText(
                      isService ? item.description : item.reason,
                      30
                    )}
                  </TableCell>
                  <TableCell>
                    {isService
                      ? `$${item.price.toFixed(2)}`
                      : new Date(item.reportDate).toLocaleDateString()}
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
                        {isService ? (
                          <DropdownMenuItem
                            onClick={() => handleViewService(item)}
                          >
                            <Eye className="mr-2 h-4 w-4 text-blue-500" />
                            Ver Detalles
                          </DropdownMenuItem>
                        ) : (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleViewReport(item)}
                            >
                              <Eye className="mr-2 h-4 w-4 text-blue-500" />
                              Visualizar Reporte
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleViewProduct(item.productId)}
                            >
                              <Package className="mr-2 h-4 w-4 text-green-500" />
                              Ver Producto
                            </DropdownMenuItem>
                          </>
                        )}
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
            {filteredItems.length}{' '}
            {selectedCategory === 'servicios' ? 'servicios' : 'reportes'}.
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

      {/* Dialog for viewing reports */}
      <Dialog
        open={isViewReportDialogOpen}
        onOpenChange={setIsViewReportDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Visualizar reporte</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productName" className="text-right">
                  Producto
                </Label>
                <Input
                  id="productName"
                  value={
                    productNames[selectedReport.productId] || 'Cargando...'
                  }
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
                  value={new Date(selectedReport.reportDate).toLocaleString()}
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
                  value={selectedProduct.status}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productLabels" className="text-right">
                  Etiquetas
                </Label>
                <Input
                  id="productLabels"
                  value={selectedProduct.labels.join(', ')}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productIdBusiness" className="text-right">
                  ID de Negocio
                </Label>
                <Input
                  id="productIdBusiness"
                  value={selectedProduct.idBusiness}
                  readOnly
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewProductDialogOpen(false)}
            >
              Cerrar
            </Button>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteProductDialogOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar Producto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for viewing services */}
      <Dialog
        open={isViewServiceDialogOpen}
        onOpenChange={setIsViewServiceDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Información del Servicio</DialogTitle>
          </DialogHeader>
          {selectedService && (
            <div className="grid gap-4 py-4">
              <div className="w-full h-40 relative mb-4">
                <Image
                  src={selectedService.photoUrl}
                  alt={selectedService.name}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="serviceName" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="serviceName"
                  value={selectedService.name}
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
                  value={selectedService.description}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="servicePrice" className="text-right">
                  Precio
                </Label>
                <Input
                  id="servicePrice"
                  value={`$${selectedService.price.toFixed(2)}`}
                  readOnly
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewServiceDialogOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for confirming product deletion */}
      <Dialog
        open={isDeleteProductDialogOpen}
        onOpenChange={setIsDeleteProductDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
          </DialogHeader>
          <p>¿Está seguro de que desea eliminar este producto?</p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteProductDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
