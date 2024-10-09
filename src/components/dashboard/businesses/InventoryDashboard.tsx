'use client'

import { useState, useRef } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eye, Trash2, MoreVertical, Edit, ArrowUpDown, Upload } from 'lucide-react'
import Image from 'next/image'

// Mock data
const initialProducts = [
  { id: 1, name: "Choco galletas", category: "Alimento", stock: 100, image: "/placeholder.svg" },
  { id: 2, name: "Brownies de arequipe", category: "Alimento", stock: 400, image: "/placeholder.svg" },
  { id: 3, name: "Vapes", category: "Cigarrillos", stock: 50, image: "/placeholder.svg" },
  { id: 4, name: "Stickers", category: "Papelería", stock: 20, image: "/placeholder.svg" },
  { id: 5, name: "Calculadoras", category: "Papelería", stock: 800, image: "/placeholder.svg" },
]

type SortField = 'name' | 'category' | 'stock'
type SortOrder = 'asc' | 'desc'

export default function InventoryDashboard() {
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [newProduct, setNewProduct] = useState({ name: "", category: "", stock: "", image: "/placeholder.svg" })
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isModifyDialogOpen, setIsModifyDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<typeof initialProducts[0] | null>(null)
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredAndSortedProducts = products
    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1
      if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.category && newProduct.stock) {
      setProducts([...products, { ...newProduct, id: products.length + 1, stock: parseInt(newProduct.stock) }])
      setNewProduct({ name: "", category: "", stock: "", image: "/placeholder.svg" })
      setIsAddDialogOpen(false)
    }
  }

  const handleDeleteProduct = () => {
    if (selectedProduct) {
      setProducts(products.filter(product => product.id !== selectedProduct.id))
      setIsDeleteDialogOpen(false)
      setSelectedProduct(null)
    }
  }

  const handleModifyProduct = () => {
    if (selectedProduct) {
      setProducts(products.map(product => 
        product.id === selectedProduct.id ? selectedProduct : product
      ))
      setIsModifyDialogOpen(false)
      setSelectedProduct(null)
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isNewProduct: boolean) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (isNewProduct) {
          setNewProduct({ ...newProduct, image: reader.result as string })
        } else if (selectedProduct) {
          setSelectedProduct({ ...selectedProduct, image: reader.result as string })
        }
      }
      reader.readAsDataURL(file)
    }
  }

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
                <Label htmlFor="category" className="text-right">
                  Categoría
                </Label>
                <Select
                  onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alimento">Alimento</SelectItem>
                    <SelectItem value="Cigarrillos">Cigarrillos</SelectItem>
                    <SelectItem value="Papelería">Papelería</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stock" className="text-right">
                  Stock inicial
                </Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  className="col-span-3"
                />
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
                    onChange={(e) => handleImageUpload(e, true)}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <Button onClick={() => fileInputRef.current?.click()} type="button">
                    <Upload className="mr-2 h-4 w-4" /> Subir imagen
                  </Button>
                </div>
              </div>
              {newProduct.image && (
                <div className="col-span-4">
                  <Image src={newProduct.image} alt="Vista previa" width={100} height={100} />
                </div>
              )}
            </div>
            <Button onClick={handleAddProduct}>Guardar y enviar alianza</Button>
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
              <Button variant="ghost" onClick={() => handleSort('category')}>
                Categoría {sortField === 'category' && <ArrowUpDown className="ml-2 h-4 w-4" />}
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('stock')}>
                Stock {sortField === 'stock' && <ArrowUpDown className="ml-2 h-4 w-4" />}
              </Button>
            </TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>{product.stock}</TableCell>
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
            <div className="grid gap-4 py-4">
              <div className="flex justify-center">
                <Image src={selectedProduct.image} alt={selectedProduct.name} width={200} height={200} />
              </div>
              <div className="grid gap-2">
                <div>
                  <Label>Nombre</Label>
                  <p className="font-medium">{selectedProduct.name}</p>
                </div>
                <div>
                  <Label>Categoría</Label>
                  <p className="font-medium">{selectedProduct.category}</p>
                </div>
                <div>
                  <Label>Stock</Label>
                  <p className="font-medium">{selectedProduct.stock}</p>
                </div>
              </div>
            </div>
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
              <div className="flex justify-center mb-4">
                <Image src={selectedProduct.image} alt="Vista previa" width={150} height={150} />
              </div>
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
                  <Label htmlFor="modify-category">Categoría</Label>
                  <Select
                    value={selectedProduct.category}
                    onValueChange={(value) => setSelectedProduct({ ...selectedProduct, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alimento">Alimento</SelectItem>
                      <SelectItem  value="Cigarrillos">Cigarrillos</SelectItem>
                      <SelectItem value="Papelería">Papelería</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Label htmlFor="modify-image">Imagen</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="modify-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
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
    </div>
  )
}