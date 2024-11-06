'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, Trash2, MoreVertical, Edit, ArrowUpDown, Upload, Plus } from 'lucide-react'
import { MultiSelect } from "@/components/ui/multi-select"
import { toast } from "@/components/ui/use-toast"
import Image from 'next/image'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

interface Product {
  id: number
  idBusiness: string
  name: string
  description: string
  photoUrl: string | null
  stock: number
  price: number
  status: string
  labels: string[]
}

type SortField = 'name' | 'stock' | 'price'
type SortOrder = 'asc' | 'desc'

export default function Component() {
  // Lista predefinida de etiquetas
  const AVAILABLE_LABELS = [
    'oferta',
    'nuevo',
    'popular',
    'limitado',
    'descuento',
    'destacado'
  ]

  const [businessId, setBusinessId] = useState<string>('')
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    idBusiness: '',
    name: "",
    description: "",
    stock: 0,
    price: 0,
    status: "active",
    labels: []
  })
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const storedBusinessId = sessionStorage.getItem('currentBusinessId')
    if (storedBusinessId) {
      setBusinessId(storedBusinessId)
      setNewProduct(prev => ({
        ...prev,
        idBusiness: storedBusinessId
      }))
    } else {
      setError('No se encontró el ID del negocio')
    }
  }, [])

  useEffect(() => {
    if (businessId) {
      fetchProducts()
    }
  }, [businessId])

  const fetchProducts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/products-service/api/v1/products/businesses/${businessId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError('Error al cargar los productos')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAndSortedProducts = products
    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1
      if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

  const handleAddProduct = async () => {
    try {
      const formData = new FormData()
      formData.append('idBusiness', newProduct.idBusiness || '')
      formData.append('name', newProduct.name || '')
      formData.append('description', newProduct.description || '')
      formData.append('stock', newProduct.stock?.toString() || '0')
      formData.append('price', newProduct.price?.toString() || '0')
      formData.append('status', newProduct.status || 'active')
      formData.append('labels', JSON.stringify(selectedLabels))

      if (fileInputRef.current?.files?.[0]) {
        formData.append('photo_url', fileInputRef.current.files[0])
      }

      const response = await fetch(`${API_URL}/products-service/api/v1/products`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to create product')
      }

      const createdProduct = await response.json()
      setProducts([...products, { ...createdProduct, labels: selectedLabels }])
      setIsAddDialogOpen(false)
      resetNewProductForm()
      toast({
        title: "Éxito",
        description: "Producto creado correctamente",
      })
    } catch (err) {
      console.error('Error creating product:', err)
      toast({
        title: "Error",
        description: "Error al crear el producto",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return

    try {
      const response = await fetch(`${API_URL}/products-service/api/v1/products/${selectedProduct.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      setProducts(products.filter(p => p.id !== selectedProduct.id))
      setIsDeleteDialogOpen(false)
      setSelectedProduct(null)
      toast({
        title: "Éxito",
        description: "Producto eliminado correctamente",
      })
    } catch (err) {
      console.error('Error deleting product:', err)
      toast({
        title: "Error",
        description: "Error al eliminar el producto",
        variant: "destructive",
      })
    }
  }

  const handleModifyProduct = async () => {
    if (!selectedProduct) return

    try {
      const formData = new FormData()
      formData.append('idBusiness', selectedProduct.idBusiness)
      formData.append('name', selectedProduct.name)
      formData.append('description', selectedProduct.description)
      formData.append('stock', selectedProduct.stock.toString())
      formData.append('price', selectedProduct.price.toString())
      formData.append('status', selectedProduct.status)
      formData.append('labels', JSON.stringify(selectedProduct.labels))

      if (fileInputRef.current?.files?.[0]) {
        formData.append('photo_url', fileInputRef.current.files[0])
      }

      const response = await fetch(`${API_URL}/products-service/api/v1/products/${selectedProduct.id}`, {
        method: 'PUT',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      const updatedProduct = await response.json()
      setProducts(products.map(p => p.id === selectedProduct.id ? { ...updatedProduct, labels: selectedProduct.labels } : p))
      setIsModifyDialogOpen(false)
      toast({
        title: "Éxito",
        description: "Producto actualizado correctamente",
      })
    } catch (err) {
      console.error('Error updating product:', err)
      toast({
        title: "Error",
        description: "Error al actualizar el producto",
        variant: "destructive",
      })
    }
  }

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log('File selected:', file.name)
    }
  }

  const resetNewProductForm = () => {
    setNewProduct({
      idBusiness: businessId,
      name: "",
      description: "",
      stock: 0,
      price: 0,
      status: "active",
      labels: []
    })
    setSelectedLabels([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  if (isLoading) return <div>Cargando productos...</div>
  if (error) return <div>Error: {error}</div>

  const labelOptions = AVAILABLE_LABELS.map(label => ({
    value: label,
    label: label
  }))


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Mis productos</h1>
      <div className="flex justify-between mb-4">
        <Input
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Añadir</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Producto</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Producto
                </Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Descripción
                </Label>
                <Input
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">
                  Stock inicial
                </Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Precio
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Estado
                </Label>
                <Select
                  value={newProduct.status}
                  onValueChange={(value) => setNewProduct({ ...newProduct, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="labels" className="text-right">
                  Etiquetas
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <MultiSelect
                    options={labelOptions}
                    selected={selectedLabels}
                    onChange={setSelectedLabels}
                    className="flex-grow"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Imagen
                </Label>
                <div className="col-span-3">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <Button onClick={() => fileInputRef.current?.click()} type="button">
                    <Upload className="mr-2 h-4 w-4" /> Subir imagen
                  </Button>
                </div>
              </div>
            </div>
            <Button onClick={handleAddProduct}>Guardar producto</Button>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('name')}>
                Nombre {sortField === 'name' && <ArrowUpDown className="ml-2 h-4 w-4" />}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('stock')}>
                Stock {sortField === 'stock' && <ArrowUpDown className="ml-2 h-4 w-4" />}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('price')}>
                Precio {sortField === 'price' && <ArrowUpDown className="ml-2 h-4 w-4" />}
              </Button>
            </TableHead>
            <TableHead>Etiquetas</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.labels.join(', ')}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => {
                      setSelectedProduct(product)
                      setIsViewDialogOpen(true)
                    }}>
                      <Eye className="mr-2 h-4 w-4 text-blue-500" />
                      Visualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setSelectedProduct(product)
                      setIsModifyDialogOpen(true)
                    }}>
                      <Edit className="mr-2 h-4 w-4 text-yellow-500" />
                      Modificar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setSelectedProduct(product)
                      setIsDeleteDialogOpen(true)
                    }}>
                      <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* View Product Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Producto</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <>
              <div className="flex justify-center mb-4">
                {selectedProduct.photoUrl ? (
                  <Image
                    src={selectedProduct.photoUrl}
                    alt={selectedProduct.name}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-[200px] h-[200px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
              </div>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <div>
                    <Label>Nombre</Label>
                    <p className="font-medium">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <Label>Descripción</Label>
                    <p className="font-medium">{selectedProduct.description}</p>
                  </div>
                  <div>
                    <Label>Stock</Label>
                    <p className="font-medium">{selectedProduct.stock}</p>
                  </div>
                  <div>
                    <Label>Precio</Label>
                    <p className="font-medium">${selectedProduct.price.toFixed(2)}</p>
                  </div>
                  <div>
                    <Label>Estado</Label>
                    <p className="font-medium">{selectedProduct.status}</p>
                  </div>
                  <div>
                    <Label>Etiquetas</Label>
                    <p className="font-medium">{selectedProduct.labels.join(', ')}</p>
                  </div>
                </div>
              </div>
            </>
          )}
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Producto</DialogTitle>
          </DialogHeader>
          <p>¿Está seguro de que desea eliminar este producto?</p>
          {selectedProduct && <p className="font-medium">Producto a eliminar: {selectedProduct.name}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Confirmar Eliminación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modify Product Dialog */}
      <Dialog open={isModifyDialogOpen} onOpenChange={setIsModifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modificar Producto</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid gap-4 py-4">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="modify-name">Producto</Label>
                  <Input
                    id="modify-name"
                    value={selectedProduct.name}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="modify-description">Descripción</Label>
                  <Input
                    id="modify-description"
                    value={selectedProduct.description}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="modify-stock">Stock</Label>
                  <Input
                    id="modify-stock"
                    type="number"
                    value={selectedProduct.stock}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: parseInt(e.target.value) })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="modify-price">Precio</Label>
                  <Input
                    id="modify-price"
                    type="number"
                    value={selectedProduct.price}
                    onChange={(e) =>
                      setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="modify-status">Estado</Label>
                  <Select
                    value={selectedProduct.status}
                    onValueChange={(value) => setSelectedProduct({ ...selectedProduct, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="inactive">Inactivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="modify-labels">Etiquetas</Label>
                  <MultiSelect
                    options={labelOptions}
                    selected={selectedProduct.labels.map(label => labels.find(l => l.label === label)?.id.toString() || '')}
                    onChange={(selected) => setSelectedProduct({
                      ...selectedProduct,
                      labels: selected.map(id => labels.find(l => l.id.toString() === id)?.label || '')
                    })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="modify-image">Imagen</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="modify-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      ref={fileInputRef}
                    />
                    <Button onClick={() => fileInputRef.current?.click()} type="button">
                      <Upload className="mr-2 h-4 w-4" /> Cambiar imagen
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModifyDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleModifyProduct}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Label Dialog */}
      <Dialog open={isAddLabelDialogOpen} onOpenChange={setIsAddLabelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nueva Etiqueta</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-label" className="text-right">
                Nombre
              </Label>
              <Input
                id="new-label"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                className="col-span-3"
                placeholder="Ingrese el nombre de la etiqueta"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddLabelDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddLabel}>
              Crear Etiqueta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}